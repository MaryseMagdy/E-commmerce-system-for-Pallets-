import { first } from "rxjs";

export class ViewUserReview {
    readonly userId: string;
    constructor(userId: string){
        this.userId = userId;
    }
    
    toString(){
        return JSON.stringify({
            userId: this.userId
        });
    }
}