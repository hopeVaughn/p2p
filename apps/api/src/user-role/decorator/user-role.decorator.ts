import { SetMetadata } from '@nestjs/common';

export const Roles = (...roleNames: string[]) =>
  SetMetadata('roleNames', roleNames);
