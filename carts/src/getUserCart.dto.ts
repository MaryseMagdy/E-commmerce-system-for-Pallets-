export class getUserCart{
    constructor(public readonly CartID:string){
 }
 toString(){
    return JSON.stringify({
        CartID:this.CartID,
    });
 }
}