// dto/addToCart.dto.ts
export class AddToCartDto {
    userId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    constructor(userId: string, productId: string, quantity: number, name: string, price: number) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.name = name;
        this.price = price;
        }
  }
  