import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity( { name: 'products' } )
export class Product {

    @ApiProperty({ 
        example: 'uuid', 
        description: 'Product ID', 
        uniqueItems: true 
    })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ApiProperty({ example: 'Example Product', description: 'Product Title' })
    @Column('text', {
        unique: true,
    })
    title!: string;

    @ApiProperty({ example: 19.99, description: 'Product Price' })
    @Column('float',{
        default: 0
    })
    price!: number;

    @ApiProperty({ example: 'Example product description', description: 'Product Description' })
    @Column({
        type: 'text',
        nullable: true,
    })
    description!: string;

    @ApiProperty({ example: 'example-product', description: 'Product Slug', uniqueItems: true })
    @Column('text', {
        unique: true,
    })
    slug!: string;
    
    @ApiProperty({ example: 0, description: 'Product Stock' })
    @Column('int', {
        default: 0,
    })
    stock!: number;

    @ApiProperty({ example: ['S', 'M', 'L'], description: 'Product Sizes' })
    @Column('text', {
        array: true,
    })
    sizes!: string[];

    @ApiProperty({ example: 'men', description: 'Product Gender' })
    @Column('text')
    gender!: string;

    @ApiProperty({ example: ['tag1', 'tag2'], description: 'Product Tags' })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags!: string[];

    //image
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.Products,
        { eager: true }
    )
    user!: User

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.title;
        }
        this.slug = this.slug
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
    }

}
