export class CreateUserEvent{
    constructor(
        public readonly firstName:string,
        public readonly lastName:string,
        public readonly username:string,
        public readonly password:string,
        public readonly email:string,
        public readonly phoneNum:string,
        public readonly company:string,
        public readonly address:string
    
    ){}
    toString(){
        return JSON.stringify({
           firstName:this.firstName,
            lastName:this.lastName,
            username:this.username,
            password:this.password,
            email:this.email,
            phoneNum:this.phoneNum,
            company:this.company,
            address:this.address
        });
    }
}