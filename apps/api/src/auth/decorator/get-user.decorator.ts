/**
 * A decorator that retrieves the authenticated user from the request object.
 * @param data Optional parameter to retrieve a specific property from the user object.
 * @param ctx The execution context of the request.
 * @returns The user object or a specific property from the user object.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
