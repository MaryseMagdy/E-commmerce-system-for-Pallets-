export class TokenDto{
    readonly token:string;
    readonly expiresIn:string;
    readonly refreshTokenexpiresIn:Date;
    readonly expired:Boolean;

    constructor(token:string,expiresIn:string,refreshTokenexpiresIn:Date,expired:Boolean){
        this.token = token;
        this.expiresIn = expiresIn;
        this.refreshTokenexpiresIn = refreshTokenexpiresIn;
        this.expired = expired;
    }
}