import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { use } from 'passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {

    console.log({request });

    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rawHeaders
    }

  }
  //@SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser! )
  @UseGuards( AuthGuard(), UserRoleGuard )
  Private2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @RoleProtected( ValidRoles.superUser! )
  @UseGuards( AuthGuard(), UserRoleGuard )
  Private3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }



}
