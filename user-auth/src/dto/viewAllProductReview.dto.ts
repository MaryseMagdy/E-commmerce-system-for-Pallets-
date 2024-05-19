import { first } from "rxjs";

export class ViewAllProductReview {
    readonly productId: string;
    constructor(productId: string) {
        this.productId = productId;
    }
    toString() {
        return JSON.stringify({
            productId: this.productId
        });
    }
}