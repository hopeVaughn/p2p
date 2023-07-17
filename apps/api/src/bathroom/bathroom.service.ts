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

  /**
   * Check if the user is the creator of the bathroom
   * @param userId - The id of the user
   * @param bathroomId - The id of the bathroom
   * @returns A boolean indicating whether the user is the creator of the bathroom
   * @throws NotFoundException if the bathroom is not found
   */
  async isCreator(userId: string, bathroomId: string): Promise<boolean> {
    // Find the bathroom by id
    const bathroom = await this.prisma.bathroom.findUnique({
      where: { id: bathroomId },
    });

    // If bathroom not found, throw a NotFoundException
    if (!bathroom)
      throw new NotFoundException('Bathroom created by this user not found');

    // Return true if the user is the creator of the bathroom
    return bathroom.createdById === userId;
  }

  /**
   * Create a new bathroom
   * @param createBathroomDto - The data for creating a new bathroom
   * @returns The created bathroom
   * @throws InternalServerErrorException if there is an error during bathroom creation
   */
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

      // Return the created bathroom
      return bathroom;
    } catch (error) {
      // If there is an error, throw an InternalServerErrorException
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  /**
   * Find all bathrooms
   * @returns An array of all bathrooms with their verification count
   * @throws InternalServerErrorException if there is an error retrieving bathrooms
   */
  async findAll() {
    try {
      // Find all bathrooms and include their verifications
      const bathrooms = await this.prisma.bathroom.findMany({
        include: {
          verifications: true,
        },
      });

      // Map the bathrooms to include the verification count
      return bathrooms.map((bathroom) => {
        const { verifications, ...rest } = bathroom;
        return {
          ...rest,
          verificationCount: verifications.length,
        };
      });
    } catch (error) {
      // If there is an error, throw an InternalServerErrorException
      throw new InternalServerErrorException('Error retrieving bathrooms');
    }
  }

  /**
   * Find a bathroom by id
   * @param id - The id of the bathroom to find
   * @returns The bathroom with the given id
   * @throws NotFoundException if the bathroom is not found
   * @throws InternalServerErrorException if there is an error retrieving the bathroom
   */
  async findOne(id: string) {
    try {
      // Find the bathroom by id
      const bathroom = await this.prisma.bathroom.findUnique({
        where: { id },
      });

      // If bathroom not found, throw a NotFoundException
      if (!bathroom) throw new NotFoundException('Bathroom not found');

      // Return the bathroom
      return bathroom;
    } catch (error) {
      // If there is an error, throw an InternalServerErrorException or a NotFoundException
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  /**
   * Update a bathroom by id
   * @param id - The id of the bathroom to update
   * @param updateBathroomDto - The data for updating the bathroom
   * @returns The updated bathroom
   * @throws NotFoundException if the bathroom is not found
   * @throws InternalServerErrorException if there is an error updating the bathroom
   */
  async update(id: string, updateBathroomDto: UpdateBathroomDto) {
    try {
      // Find the bathroom by id
      const bathroom = await this.prisma.bathroom.findUnique({ where: { id } });

      // If bathroom not found, throw a NotFoundException
      if (!bathroom) throw new NotFoundException('Bathroom not found');

      // Update the bathroom and return the updated bathroom
      return await this.prisma.bathroom.update({
        where: { id },
        data: updateBathroomDto,
      });
    } catch (error) {
      // If there is an error, throw an InternalServerErrorException or a NotFoundException
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Error during bathroom creation: ${error.message}`,
      );
    }
  }

  /**
   * Remove a bathroom by id
   * @param id - The id of the bathroom to remove
   * @param userId - The id of the user requesting to remove the bathroom
   * @returns The deleted bathroom
   * @throws UnauthorizedException if the user is not the creator of the bathroom
   * @throws InternalServerErrorException if there is an error deleting the bathroom
   */
  async remove(id: string, userId: string) {
    // Check if the user is the creator of the bathroom
    const isCreator = await this.isCreator(userId, id);

    // If the user is not the creator of the bathroom, throw an UnauthorizedException
    if (!isCreator) {
      throw new UnauthorizedException(
        'You are not authorized to delete this bathroom.',
      );
    }

    try {
      // Delete the bathroom and return the deleted bathroom
      return await this.prisma.bathroom.delete({ where: { id } });
    } catch (error) {
      // If there is an error, throw an InternalServerErrorException
      throw new InternalServerErrorException(
        `Error during bathroom deletion: ${error.message}`,
      );
    }
  }
}
