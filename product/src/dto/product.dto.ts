import { first } from 'rxjs/operators';

export class productDTO {
  readonly image: string;
  readonly name: string;
  readonly price: number;
  readonly rating: number;
  readonly description: string;
  readonly availability: boolean;
  readonly color: string;
  readonly material: string;
  readonly width: number;
  readonly height: number;
  readonly quantity: number;
  readonly customized: boolean;
  readonly ratings: number[];

  constructor(image: string, name: string, price: number, rating: number, description: string,quantity:number, availability: boolean, color: string, material: string, width: number, height:number,customized: boolean, ratings: number[]) {
    this.image = image;
    this.name = name;
    this.price = price;
    this.rating = rating;
    this.description = description;
    this.availability = availability;
    this.color = color;
    this.material = material;
    this.width = width;
    this.height=height;
    this.quantity = quantity;
    this.customized = customized;
    this.ratings = ratings;
  }
      
    toString() {
        return JSON.stringify({
            image: this.image,
            name: this.name,
            price: this.price,
            rating: this.rating,
            description: this.description,
            availability: this.availability,
            color: this.color,
            material: this.material,
            width: this.width,
            height: this.height,
            quantity: this.quantity,
            customized: this.customized,
            ratings: this.ratings
        });
    
}
}