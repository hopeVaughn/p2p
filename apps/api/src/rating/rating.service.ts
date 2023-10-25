import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor (private prisma: PrismaService) { }

  /**
   * Creates a new rating for a bathroom or updates an existing one if the user has already rated it.
   * @param createRatingDto The data for the new rating.
   * @returns The newly created or updated rating.
   * @throws NotFoundException if the bathroom with the given ID does not exist.
   * @throws InternalServerErrorException if there was an error creating or updating the rating.
   */
  async createOrUpdate(createRatingDto: CreateRatingDto) {
    try {
      const { bathroomId, ratedById, stars } = createRatingDto;

      const bathroom = await this.prisma.bathroom.findUnique({
        where: { id: bathroomId },
      });

      if (!bathroom) {
        throw new NotFoundException(`Bathroom with id ${bathroomId} does not exist`);
      }

      const existingRating = await this.prisma.rating.findFirst({
        where: {
          bathroomId,
          ratedById,
        },
      });

      let newRating: unknown;

      if (bathroom.createdById === ratedById) { // If the rater is the bathroom's creator
        if (existingRating) {
          // Update existing rating by the creator
          newRating = await this.prisma.rating.update({
            where: {
              id: existingRating.id,
            },
            data: {
              stars,
            },
          });
        } else {
          // Create new rating by the creator
          newRating = await this.prisma.rating.create({
            data: {
              bathroom: { connect: { id: bathroomId } },
              ratedBy: { connect: { id: ratedById } },
              stars,
            },
          });
        }
      } else { // If the rater isn't the bathroom's creator
        if (existingRating) {
          // Update existing rating by the user
          newRating = await this.prisma.rating.update({
            where: {
              id: existingRating.id,
            },
            data: {
              stars,
            },
          });
        } else {
          // Create new rating by the user
          newRating = await this.prisma.rating.create({
            data: {
              bathroom: { connect: { id: bathroomId } },
              ratedBy: { connect: { id: ratedById } },
              stars,
            },
          });
        }
        // Calculate and update average rating for the bathroom
        await this.updateAverageStars(bathroomId);
      }

      return newRating;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Error during rating creation: ${error.message}`);
      }
    }
  }


  /**
   * Gets the average rating for a bathroom.
   * @param bathroomId The ID of the bathroom to get the average rating for.
   * @returns The average rating for the bathroom, rounded down to a whole number, or null if there are no ratings yet.
   */
  async getAverageRatingForBathroom(bathroomId: string): Promise<number> {
    const result = await this.prisma.rating.groupBy({
      by: ['bathroomId'],
      where: { bathroomId },
      _avg: {
        stars: true,
      },
    });

    // If there are no ratings yet, we should return 0 (or another default value if desired)
    if (result.length === 0) {
      return 0;
    }

    // Return the average rating rounded to the nearest whole number
    return Math.round(result[0]._avg.stars);
  }

  /**
   * Updates the average stars for a bathroom.
   * @param bathroomId The ID of the bathroom to update the average stars for.
   * @throws InternalServerErrorException if there was an error updating the average stars.
   */
  async updateAverageStars(bathroomId: string): Promise<unknown> {
    const averageStars = await this.getAverageRatingForBathroom(bathroomId);
    if (typeof averageStars !== 'number') {
      // Ensure this always returns a rejected promise rather than throwing directly
      return Promise.reject(new InternalServerErrorException('Error retrieving average stars'));
    }
    return this.prisma.bathroom.update({
      where: { id: bathroomId },
      data: { stars: averageStars },
    });
  }

}
