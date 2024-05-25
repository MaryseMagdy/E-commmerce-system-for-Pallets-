export class AddToWishlistDTO {
    readonly userId: string;
    readonly productId: string;
    constructor(userId: string, productId: string) {
      this.userId = userId;
      this.productId = productId;
    }
  }
  