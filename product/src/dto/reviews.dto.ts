export class Reviews {
    readonly content: string;
    readonly userId: string;
     productId: string;
    readonly rating: number;
  
    // Constructor initialization
    constructor(content: string, userId: string, productId: string, rating: number) {
      this.content = content;
      this.userId = userId;
      this.productId = productId;
      this.rating = rating;
    }
  
    // toString method
    toString() {
      return JSON.stringify({
        content: this.content,
        userId: this.userId,
        productId: this.productId,
        rating: this.rating
      });
    }
  }