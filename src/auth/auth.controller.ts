import {
  Body,
  Controller,
  Req,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response, Request } from 'express';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Signup: Issue both access and refresh tokens
  @Post('/signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);

    // Set refresh token in HttpOnly cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  // Login: Issue both access and refresh tokens
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    // Set refresh token in HttpOnly cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  // Get current user details
  @Get('/me')
  @UseGuards(AuthGuard('jwt')) // Protect with access token
  async getMe(@Req() req): Promise<any> {
    const userId = req.user.id; // Extract user ID from JWT payload
    return this.authService.getMe(userId);
  }

  // Refresh access token using refresh token
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies['refresh_token']; // Get refresh token from cookie

    if (!refreshToken) {
      throw new Error('Refresh token not found'); // Handle appropriately
    }

    // Generate new access token
    const { accessToken, newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    // Optionally update the refresh token in the cookie
    res.cookie('refresh_token', newRefreshToken || refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }
}
