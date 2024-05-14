import { first } from "rxjs";

export class ViewUserReview {
    readonly userId: string;
    toString(){
        return JSON.stringify({
            userId: this.userId
        });
    }
}