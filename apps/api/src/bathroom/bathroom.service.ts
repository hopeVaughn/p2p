import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBathroomDto, UpdateBathroomDto } from './dto/bathroom.dto';

@Injectable()
export class BathroomService {
  constructor(private prisma: PrismaService) {}

  async create(createBathroomDto: CreateBathroomDto) {
    try {
      return await this.prisma.bathroom.create({
        data: {
          ...createBathroomDto,
          createdBy: {
            connect: {
              id: createBathroomDto.createdBy,
            },
          },
        },
      });
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

  async remove(id: string) {
    try {
      const bathroom = await this.prisma.bathroom.findUnique({ where: { id } });
      if (!bathroom) throw new NotFoundException('Bathroom not found');

      return await this.prisma.bathroom.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }
}
