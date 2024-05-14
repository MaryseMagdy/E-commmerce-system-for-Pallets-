import mongoose from "mongoose";
import { first } from "rxjs";

export class Reviews {
    readonly content: string;
    readonly userId: string;
    readonly productId: string;
    readonly rating: number;

    toString() {
        return JSON.stringify({
            content:this.content,
            userId:this.userId,
            productId: this.productId,
            rating: this.rating
        });
    }
}