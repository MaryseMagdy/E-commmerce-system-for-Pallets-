
export class userInfoDTO {
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly email: string;
    readonly phoneNum: string;
    readonly company?: string;
    readonly address?: string;
  
    constructor(
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      phoneNum: string,
      company?: string,
      address?: string,
    ) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
      this.email = email;
      this.phoneNum = phoneNum;
      this.company = company;
      this.address = address;
    }
  
    toString() {
      return JSON.stringify({
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
        phoneNum: this.phoneNum,
        company: this.company,
        address: this.address,
      });
    }
  }
  