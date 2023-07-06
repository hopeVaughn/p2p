import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { message: 'I am a new user signing up' };
  }

  signin() {
    return { message: 'I am a user signing in' };
  }
}
