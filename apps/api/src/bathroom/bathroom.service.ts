import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBathroomDto, UpdateBathroomDto } from './dto/bathroom.dto';
import { RatingService } from 'src/rating/rating.service';
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
      return await this.prisma.bathroom.findMany();
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

  async verify(id: string, userId: string) {
    try {
      const bathroom = await this.prisma.bathroom.findUnique({ where: { id } });
      if (!bathroom) throw new NotFoundException('Bathroom not found');

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // Check if the user is the creator of the bathroom
      if (bathroom.createdById === userId) {
        throw new BadRequestException(
          'A bathroom cannot be verified by its creator.',
        );
      }

      return await this.prisma.bathroom.update({
        where: { id },
        data: { verifiedByUser: { connect: { id: userId } } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom verification: ${error.message}`,
      );
    }
  }
}
