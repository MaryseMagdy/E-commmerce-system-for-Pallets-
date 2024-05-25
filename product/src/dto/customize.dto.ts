import { first } from 'rxjs/operators';
export class customizeDTO {
  readonly color: string;
  readonly material: string;
  readonly width: number;
  readonly height: number;
  readonly quantity: number;
  readonly customized: boolean;

  constructor(color: string, material: string, width: number,height:number, quantity:number, customized: boolean) {
    this.color = color;
    this.material = material;
    this.width = width;
    this.height = height;
    this.quantity = quantity;
    this.customized = customized;
  }

  toString() {
    return JSON.stringify({
      color: this.color,
      material: this.material,
      width: this.width,
      height: this.height,
      quantity: this.quantity,
      customized: this.customized,
    });
  }
}
