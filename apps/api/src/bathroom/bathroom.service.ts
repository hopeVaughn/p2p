import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBathroomDto, UpdateBathroomDto } from './dto/bathroom.dto';
import { RatingService } from '../rating/rating.service';
@Injectable()
export class BathroomService {
  constructor(
    private prisma: PrismaService,
    private ratingService: RatingService,
  ) {}

  async isCreator(userId: string, bathroomId: string): Promise<boolean> {
    const bathroom = await this.prisma.bathroom.findUnique({
      where: { id: bathroomId },
    });

    if (!bathroom)
      throw new NotFoundException('Bathroom created by this user not found');

    return bathroom.createdById === userId;
  }

  async create(createBathroomDto: CreateBathroomDto) {
    try {
      const { createdBy, stars } = createBathroomDto;

      // Create the bathroom
      const bathroom = await this.prisma.bathroom.create({
        data: {
          ...createBathroomDto,
          createdBy: {
            connect: {
              id: createdBy,
            },
          },
        },
      });

      // Create the initial rating for the bathroom
      await this.ratingService.create({
        bathroomId: bathroom.id,
        ratedById: createdBy,
        stars,
      });

      return bathroom;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const bathrooms = await this.prisma.bathroom.findMany({
        include: {
          verifications: true,
        },
      });

      return bathrooms.map((bathroom) => {
        const { verifications, ...rest } = bathroom;
        return {
          ...rest,
          verificationCount: verifications.length,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving bathrooms');
    }
  }

  async findOne(id: string) {
    try {
      const bathroom = await this.prisma.bathroom.findUnique({
        where: { id },
      });
      if (!bathroom) throw new NotFoundException('Bathroom not found');
      return bathroom;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  async update(id: string, updateBathroomDto: UpdateBathroomDto) {
    try {
      const bathroom = await this.prisma.bathroom.findUnique({ where: { id } });
      if (!bathroom) throw new NotFoundException('Bathroom not found');

      return await this.prisma.bathroom.update({
        where: { id },
        data: updateBathroomDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  async remove(id: string, userId: string) {
    const isCreator = await this.isCreator(userId, id);

    if (!isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to delete this bathroom.',
      );
    }

    try {
      return await this.prisma.bathroom.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error during bathroom deletion: ${error.message}`,
      );
    }
  }
}
