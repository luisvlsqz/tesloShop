import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {

    @ApiProperty({ example: 'Example Product', description: 'Product Title' })
    @IsString()
    @MinLength(1)
    title!: string;

    @ApiProperty({ example: 19.99, description: 'Product Price' })
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty({ example: 'Example product description', description: 'Product Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'example-product', description: 'Product Slug' })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 0, description: 'Product Stock' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({ example: ['S', 'M', 'L'], description: 'Product Sizes' })
    @IsString({ each: true })
    @IsArray()
    sizes!: string[];

    @ApiProperty({ example: 'men', description: 'Product Gender' })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender!: string;

    @ApiProperty({ example: ['tag1', 'tag2'], description: 'Product Tags' })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags!: string[];

    @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'Product Images' })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images!: string[];

}

