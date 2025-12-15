import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Product } from './product.entity';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllProducts() {
    return await this.productRepository.find();
  }

  public async getProductById(id: number) {
    return await this.productRepository.findOne({
      where: { id },
    });
  }

  public async createProduct(productData: any) {
    console.log('56+565546546464543', productData);
    const newProduct = this.productRepository.create({
      ...productData,
    });
    return await this.productRepository.save(newProduct);
  }

  public async updateProductData(id: number, body: any) {
    return await this.productRepository.update(id, body);
  }
  public async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }
} 