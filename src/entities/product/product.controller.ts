import {
  Controller,
  Get,
  Req,
  Post,
  Res,
  Put,
  Delete,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Body,
  UploadedFile,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { renameUploadedFile } from '@helpers/fileUploader';
import { getMulterOptions } from '@helpers/fileUploader';
import { ProductService } from './product.service';
import { PRODUCTS_IMAGES_FOLDER_PATH } from '@consts/storagePaths';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAllProducts(@Req() req: Request, @Res() res: Response) {
    const products = await this.productService.getAllProducts();
    return res.send({ status: 'ok', data: products });
  }

  @Get('/:id')
  async getProduct(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const productData = await this.productService.getProductById(id);
    return res.send({ status: 'ok', data: { productData } });
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('image', getMulterOptions('images/products')),
  )
  async createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const newFilename = renameUploadedFile(
      image.filename,
      PRODUCTS_IMAGES_FOLDER_PATH,
    );
    await this.productService.createProduct({
      ...body,
      image: newFilename,
    });
    return res.send({ status: 'ok' });
  }

  @Put('/:id')
  async updateProduct(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    await this.productService.updateProductData(id, body);
    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.productService.deleteProduct(id);
    return res.send({ status: 'ok' });
  }
}
