import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto, UpdateRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new rating for a bathroom or updates an existing one if the user has already rated it.
   * @param createRatingDto The data for the new rating.
   * @returns The newly created or updated rating.
   * @throws NotFoundException if the bathroom with the given ID does not exist.
   * @throws InternalServerErrorException if there was an error creating or updating the rating.
   */
  async create(createRatingDto: CreateRatingDto) {
    try {
      const { bathroomId, ratedById, stars } = createRatingDto;

      // Check if the bathroom exists
      const bathroom = await this.prisma.bathroom.findUnique({
        where: { id: bathroomId },
      });

      if (!bathroom) {
        throw new NotFoundException(
          `Bathroom with id ${bathroomId} does not exist`,
        );
      }

      // Check if the user has already rated the bathroom
      const existingRating = await this.prisma.rating.findFirst({
        where: {
          bathroomId,
          ratedById,
        },
      });

      let newRating;

      if (existingRating) {
        // Update the existing rating instead of creating a new one
        newRating = await this.prisma.rating.update({
          where: {
            id: existingRating.id,
          },
          data: {
            stars,
          },
        });
      } else {
        // Create a new rating entry
        newRating = await this.prisma.rating.create({
          data: {
            bathroom: { connect: { id: bathroomId } },
            ratedBy: { connect: { id: ratedById } },
            stars,
          },
        });
      }

      // Update the average stars for the bathroom
      await this.updateAverageStars(bathroomId);

      return newRating;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          `Error during rating creation: ${error.message}`,
        );
      }
    }
  }

  /**
   * Updates an existing rating for a bathroom.
   * @param id The ID of the rating to update.
   * @param ratedById The ID of the user who rated the bathroom.
   * @param updateRatingDto The new data for the rating.
   * @returns The updated rating.
   * @throws NotFoundException if the rating with the given ID and user ID does not exist.
   * @throws InternalServerErrorException if there was an error updating the rating.
   */
  async update(
    id: string,
    ratedById: string,
    updateRatingDto: UpdateRatingDto,
  ) {
    try {
      const rating = await this.prisma.rating.findFirst({
        where: {
          id,
          ratedById,
        },
      });

      if (!rating) throw new NotFoundException('Rating not found');

      const updatedRating = await this.prisma.rating.update({
        where: { id },
        data: updateRatingDto,
      });

      // Update the average stars for the bathroom
      await this.updateAverageStars(rating.bathroomId);

      return updatedRating;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating the rating');
    }
  }

  /**
   * Gets the average rating for a bathroom.
   * @param bathroomId The ID of the bathroom to get the average rating for.
   * @returns The average rating for the bathroom, rounded down to a whole number, or null if there are no ratings yet.
   */
  async getAverageRating(bathroomId: string): Promise<number> {
    const result = await this.prisma.rating.groupBy({
      by: ['bathroomId'],
      where: { bathroomId },
      _avg: {
        stars: true,
      },
    });

    // If there are no ratings yet, we should return null
    if (result.length === 0) {
      return null;
    }

    // Else return the average rating rounded down to a whole number
    return Math.floor(result[0]._avg.stars);
  }

  /**
   * Updates the average stars for a bathroom.
   * @param bathroomId The ID of the bathroom to update the average stars for.
   * @throws InternalServerErrorException if there was an error updating the average stars.
   */
  async updateAverageStars(bathroomId: string) {
    try {
      const averageStars = await this.getAverageRating(bathroomId);
      await this.prisma.bathroom.update({
        where: { id: bathroomId },
        data: { stars: averageStars },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating the average stars for the bathroom',
      );
    }
  }
}
