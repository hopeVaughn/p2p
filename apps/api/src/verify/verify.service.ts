import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerifyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Verifies a bathroom by creating a verification entry in the database.
   * @param bathroomId The ID of the bathroom to be verified.
   * @param userId The ID of the user performing the verification.
   * @returns The verification entry created in the database.
   * @throws NotFoundException if the bathroom with the given ID is not found.
   * @throws BadRequestException if the user is the creator of the bathroom or has already verified the bathroom.
   * @throws InternalServerErrorException if there is an error during the verification process.
   */
  async verify(bathroomId: string, userId: string) {
    try {
      // Fetch the bathroom to be verified
      const bathroom = await this.prisma.bathroom.findUnique({
        where: { id: bathroomId },
      });
      if (!bathroom) {
        throw new NotFoundException('Bathroom not found');
      }

      // Ensure the user is not the creator of the bathroom
      if (bathroom.createdById === userId) {
        throw new BadRequestException(
          'A user cannot verify their own bathroom',
        );
      }

      // Check if the user has already verified this bathroom
      const existingVerification = await this.prisma.verification.findFirst({
        where: {
          verifiedById: userId,
          bathroomId: bathroomId,
        },
      });

      if (existingVerification) {
        throw new BadRequestException(
          'A user cannot verify a bathroom more than once',
        );
      }

      // Create the verification entry
      const verification = await this.prisma.verification.create({
        data: {
          bathroomId: bathroomId,
          verifiedById: userId,
        },
      });

      return verification;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error during verification: ${error.message}`,
      );
    }
  }

  /**
   * Counts the number of verifications for a given bathroom.
   * @param bathroomId The ID of the bathroom to count verifications for.
   * @returns The number of verifications for the given bathroom.
   */
  async countVerifications(bathroomId: string): Promise<number> {
    const count = await this.prisma.verification.count({
      where: { bathroomId },
    });
    return count;
  }
}
