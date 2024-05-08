import { first } from "rxjs";

export class productDTO {
  readonly image: string;
  readonly name: string;
  readonly price: number;
  readonly rating: number;
  readonly description: string;
  readonly availability: boolean;
  readonly color: string;
  readonly material: string;
  readonly size: number;
  readonly customized: boolean;
  readonly id: string;
  readonly ratings: number[];

      
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
            size: this.size,
            customized: this.customized,
            id: this.id,
            ratings: this.ratings
        });
    
}
}