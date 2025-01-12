import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Generate access and refresh tokens
  private generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(
      { id: userId },
      { expiresIn: '15m' }, // Short-lived access token
    );

    const refreshToken = this.jwtService.sign(
      { id: userId },
      { expiresIn: '7d' }, // Long-lived refresh token
    );

    return { accessToken, refreshToken };
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { firstname, lastname, email, password } = signUpDto;

    const name = firstname + ' ' + lastname;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.generateTokens(user._id.toString());
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user._id.toString());
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken?: string }> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Fetch the user from the database
      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token and optionally a new refresh token
      const accessToken = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '15m' },
      );

      // Optional: Regenerate refresh token (e.g., for rotation)
      const newRefreshToken = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '7d' },
      );

      return { accessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password'); // Exclude password
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
