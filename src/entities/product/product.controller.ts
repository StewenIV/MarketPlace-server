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
import { HttpException, HttpStatus } from '@nestjs/common';

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
    if (image == null || image == undefined) {
      throw new HttpException(
        {
          message: 'Image file is required',
          status: 'error',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newFilename = renameUploadedFile(
      image.filename,
      PRODUCTS_IMAGES_FOLDER_PATH,
    );
    await this.productService.createProduct({
      ...body,
      image: newFilename,
    });
    return res.send({ status: 'ok', data: { ...body, image: newFilename } });
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('image', getMulterOptions('images/products')),
  )
  async updateProduct(
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    console.log('Updating product with ID:', id, 'with data:', body, image);
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new HttpException(
        {
          message: 'Product not found',
          status: 'error',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const updateData: any = { ...body };

    // Только если прислали новое изображение — обрабатываем его
    if (image) {
      const newFilename = renameUploadedFile(
        image.filename,
        PRODUCTS_IMAGES_FOLDER_PATH,
      );
      updateData.image = newFilename;
    }
    // Если image === undefined — просто НЕ трогаем поле image в БД (оно останется прежним)

    await this.productService.updateProductData(id, updateData);

    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new HttpException(
        {
          message: 'Product not found',
          status: 'error',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.productService.deleteProduct(id);
    return res.send({ status: 'ok' });
  }
}
