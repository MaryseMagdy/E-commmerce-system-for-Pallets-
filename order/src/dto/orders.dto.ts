export class OrdersDTO {
  orderNumber: string;
  date: Date;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;

  constructor(
    orderNumber: string,
    date: Date,
    items: Array<{ productId: string; quantity: number; price: number }>,
    totalAmount: number,
    status: string
  ) {
    this.orderNumber = orderNumber;
    this.date = date;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = status;
  }

  toString() {
    return JSON.stringify({
      orderNumber: this.orderNumber,
      date: this.date,
      items: this.items,
      totalAmount: this.totalAmount,
      status: this.status,
    });
  }
}
