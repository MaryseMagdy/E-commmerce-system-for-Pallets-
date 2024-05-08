import { first } from "rxjs";

export class cartsDTO {
        productId: string; // Assuming productId is a string
        price: number; // Assuming price is a number
        userId: string; // Assuming userId is a string
        quantity: number;
      
      
    toString() {
        return JSON.stringify({
            productId: this.productId,
            price: this.price,
            userId: this.userId,
            quantity: this.userId
        });
    
}
}