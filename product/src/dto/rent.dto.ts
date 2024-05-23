export class rentDTO{
    readonly rentStartDate: string;
    readonly rentEndDate: string;
    // readonly totalRentalPrice:number;
    readonly deposit:number;
    // readonly totalPrice:number

    constructor( startDate: string, endDate: string, 
        // totalRentalPrice: number, 
        deposit: number,
        //  totalPrice: number
    ){
        this.rentStartDate = startDate;
        this.rentEndDate = endDate;
        // this.totalRentalPrice = totalRentalPrice;
        this.deposit = deposit;
        // this.totalPrice=totalPrice
    }
    toString(){
        return JSON.stringify({
            startDate: this.rentStartDate,
            endDate: this.rentEndDate,
            // totalRentalPrice: this.totalRentalPrice,
            deposit: this.deposit,
            // totalPrice: this.totalPrice
        });
    }

}