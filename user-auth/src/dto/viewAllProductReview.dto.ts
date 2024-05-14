import { first } from "rxjs";

export class ViewAllProductReview {
    readonly productId: string;
    toString() {
        return JSON.stringify({
            productId: this.productId
        });
    }
}