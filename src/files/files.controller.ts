import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer} from './helpers/index';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path );

  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
      fileFilter:  fileFilter,
      //limits: { fileSize: 1024 * 1024 * 5 } // 5MB
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
  }) )
  UploadFile( 
    @UploadedFile() file: Express.Multer.File 

  ) {

    if ( !file ) throw new BadRequestException('File is empty or not an image');

    //const secureUrl = `${ file.filename }`;
    const secureUrl = `${ this.configService.get('HOST_API') }/api/files/product/${ file.filename }`;

    return { secureUrl };

  }

}
