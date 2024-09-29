import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/role.enum';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAll() {
    return await this.feedbackService.getAll();
  }

  @Public()
  @Post()
  async createFeedback(@Req() req: Request, @Body() body: CreateFeedbackDTO) {
    return await this.feedbackService.create(req.user.sub, body.description);
  }
}
