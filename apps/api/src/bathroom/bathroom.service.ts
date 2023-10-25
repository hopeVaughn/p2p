import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBathroomDto } from './dto/bathroom.dto';

interface BathroomResult {
  id: string;
  latitude: number;
  longitude: number;
  gender: string;
  stallType: string;
  wheelchairAccessible: boolean;
  stars: number;
  keyRequirement: boolean;
  hoursOfOperation: string;
  address: string;
  verification_count?: number;
}

@Injectable()
export class BathroomService {
  constructor (
    private prisma: PrismaService,
  ) { }

  /**
   * Check if the user is the creator of the bathroom
   * @param userId - The id of the user
   * @param bathroomId - The id of the bathroom
   * @returns A boolean indicating whether the user is the creator of the bathroom
   * @throws NotFoundException if the bathroom is not found
   */
  async isCreator(bathroomId: string, userId: string,): Promise<boolean> {
    // Find the bathroom by id
    console.log('bathroom.service check bathroomId', bathroomId);

    const bathroom = await this.prisma.bathroom.findUnique({
      where: { id: bathroomId },
    });
    console.log('bathroom', bathroom);
    console.log('userId', userId);


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
  async createWithLocation(createBathroomDto: CreateBathroomDto) {
    const { lat, lng, ...rest } = createBathroomDto;

    const result = await this.prisma.$executeRaw`
      INSERT INTO "Bathroom" (
        "id",
        "createdById", 
        "gender", 
        "stallType", 
        "wheelchairAccessible", 
        "stars", 
        "keyRequirement", 
        "hoursOfOperation", 
        "location", 
        "address",
        "updatedAt"
      )
      VALUES (
        uuid_generate_v4(),
        ${createBathroomDto.createdBy}, 
        ${createBathroomDto.gender}::"BathroomGender", 
        ${createBathroomDto.stallType}::"StallType",   
        ${createBathroomDto.wheelchairAccessible}, 
        ${createBathroomDto.stars}, 
        ${createBathroomDto.keyRequirement}, 
        ${createBathroomDto.hoursOfOperation}, 
        ST_SetSRID(ST_Point(${lng}, ${lat}), 4326), 
        ${createBathroomDto.address},
        NOW()
      )
      RETURNING *;
    `;

    console.log('Raw SQL Insert Result:', result);

    return result;
  }
  /**
   * Find all bathrooms
   * @returns An array of all bathrooms with their verification count
   * @throws InternalServerErrorException if there is an error retrieving bathrooms
   */
  async findNearby(lat: number, lng: number, radius: number) {
    const result = await this.prisma.$queryRaw`
    SELECT 
        b.id, 
        ST_X(b.location) as latitude, 
        ST_Y(b.location) as longitude,
        b.gender, 
        b."stallType", 
        b."wheelchairAccessible", 
        b.stars, 
        b."keyRequirement", 
        b."hoursOfOperation", 
        b.address,
        COUNT(v.id) as verification_count
    FROM "Bathroom" b
    LEFT JOIN "Verification" v ON b.id = v."bathroomId"
    WHERE ST_DWithin(
        ST_Transform(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 3857),
        ST_Transform(b.location, 3857),
        ${radius}
    )
    GROUP BY 
        b.id,
        b.location,
        b.gender,
        b."stallType",
        b."wheelchairAccessible",
        b.stars,
        b."keyRequirement",
        b."hoursOfOperation",
        b.address
    ;
    ` as BathroomResult[];
    console.log('result', result);

    return result.map(bathroom => ({
      ...bathroom,
      verification_count: Number(bathroom.verification_count)
    }));

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
  async updateLocation(bathroomId: string, lat: number, lng: number) {
    const result = await this.prisma.$executeRaw`
      UPDATE "Bathroom"
      SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      WHERE id = ${bathroomId};
    `;

    return result;
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
    console.log('id', id);
    console.log('userId', userId);

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
