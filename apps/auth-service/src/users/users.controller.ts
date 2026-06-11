import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      status: 'success',
      message: 'Data user berhasil diambil',
      data: data.map((u) => ({
        ...u,
        nik: this.usersService.maskNik(u.nik),
      })),
    };
  }
}
