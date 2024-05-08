export class AddToCartDto {
    readonly userId: string;
    readonly productId: string;
    readonly price: number;
    readonly quantity: number;

    constructor(userId: string, productId: string, price: number, quantity: number) {
        this.userId = userId;
        this.productId = productId;
        this.price = price;
        this.quantity = quantity;
    }

    toString() {
        return JSON.stringify({
            userId: this.userId,
            productId: this.productId,
            price: this.price,
            quantity: this.quantity
        });
    }
}
