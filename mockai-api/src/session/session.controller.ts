import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
} from '@nestjs/common';
import { SessionService } from './session.service';
import type { AuthenticatedRequest } from 'src/auth/auth.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import pdfParse from 'pdf-parse';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @UseGuards(AuthGuard)
  @Get()
  async sessions(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }
    return this.sessionService.findAll({
      userId: parseInt(userId, 10),
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async session(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }
    return this.sessionService.findOne({
      id: parseInt(req.params.id, 10),
      userId: parseInt(userId, 10),
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('resumePdf'))
  async create(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() resumePdf: Express.Multer.File,
    @Body() data: { title: string; jobDes: string },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not found');
    }

    if (!resumePdf) {
      throw new Error('Resume PDF not found');
    }

    try {
      const pdfData = await pdfParse(resumePdf.buffer);

      return await this.sessionService.create({
        userId: parseInt(userId, 10),
        title: data.title,
        jobDesc: data.jobDes,
        resumeTxt: pdfData.text,
        startTime: new Date(),
      });
    } catch (error) {
      return { error: 'Failed to parse PDF', details: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async end(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not found');
    }
    return this.sessionService.update(parseInt(req.params.id, 10), {
      endTime: new Date(),
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not found');
    }
    return this.sessionService.delete(parseInt(req.params.id, 10));
  }
}
