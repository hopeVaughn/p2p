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

  async create(createRatingDto: CreateRatingDto) {
    try {
      const { bathroomId, ratedById, stars } = createRatingDto;
      return await this.prisma.rating.create({
        data: {
          bathroom: { connect: { id: bathroomId } },
          ratedBy: { connect: { id: ratedById } },
          stars,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error during rating creation: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    ratedById: string,
    updateRatingDto: UpdateRatingDto,
  ) {
    try {
      const rating = await this.prisma.rating.findFirst({
        where: {
          id: id,
          ratedById: ratedById,
        },
      });

      if (!rating) throw new NotFoundException('Rating not found');

      return await this.prisma.rating.update({
        where: { id: id },
        data: updateRatingDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating the rating');
    }
  }

  async getAverageRating(bathroomId: string): Promise<number> {
    const result = await this.prisma.rating.groupBy({
      by: ['bathroomId'],
      where: { bathroomId: bathroomId },
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
