
export class addToFavouritesDTO{
    readonly productName: string;
    readonly productPrice: number;
    readonly productImage: string;
    constructor( productName: string, productPrice: number, productImage: string){
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImage = productImage;
    }
    
}