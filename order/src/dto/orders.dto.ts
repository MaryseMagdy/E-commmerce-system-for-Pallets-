import { first } from "rxjs";

export class OrdersDTO {
    orderNumber: string;
    date: Date;
    items: Array<{
      productId: string; // Assuming productId is a string
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status: string;
  
      
    toString() {
        return JSON.stringify({
            ordernumber: this.orderNumber,
            date: this.date,
            items: this.items,
            totalAmount: this.totalAmount,
            status: this.status
        });
    
}
}