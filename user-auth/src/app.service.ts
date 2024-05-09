import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { userAuth } from './interfaces/userAuth';
import { UserDTO } from './dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import{ userInfoDTO } from './dto/userInfo.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class userAuthService {
    getHello(): string {
        return 'Hello World!';
      }
    constructor(
        @Inject('userAuth_MODEL')
        private userAuthModel: Model<userAuth>,        
        private jwtService:JwtService,
        private emailService: EmailService
    // ) {this.emailService = emailService;}
    ){}
    async register(UserDTO:UserDTO){
        const createAuthenticationUser= new this.userAuthModel(UserDTO)
        let saveResult = await createAuthenticationUser.save();
        return saveResult;
    }

    async validateUser(loginDto:LoginDto){
        let loginResult =await this.userAuthModel.findOne({
            username:loginDto.username,
            password:loginDto.password,
        });

        if(loginResult===null){
            return null;
        }
        
        let jsonData =loginResult.toObject();
        let {_id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }
    async getUserbyUsername(username:string){
        let loginResult =await this.userAuthModel.findOne({
            username:username,
           
        });

        if(loginResult===null){
            return null;
        }
        let jsonData =loginResult.toObject();
        let {_id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }
    async login(user: any) {
        try {
            if (!user || !user._id || !user.email || !user.username || !user.password) {
                throw new Error("Invalid user data");
            }
                let payload = {
                id: user._id,
                email: user.email,
                username: user.username
            };
            var token = this.jwtService.sign(payload);
            var tokenDecoded: any = this.jwtService.decode(token);
            return {
                access_token: token,
                expires_in: tokenDecoded.exp,
                user_id: user._id 
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    validateToken(jwt:string){
        const validatedToken = this.jwtService.sign(jwt);
        return validatedToken;
    }
    async getUserinfo(id: string) {
        let userInfo = await this.userAuthModel.findById(id);
    
        if (!userInfo) {
            return null;
        }
    
        let jsonData = userInfo.toObject();
        let { _id, ...userData } = jsonData;
    
        return {
            id: jsonData._id,
            ...userData
        };
    }
    async changePassword(userId: string, newPassword: string) {
        try {
            console.log("hi");
            const user = await this.userAuthModel.findById(userId);
            console.log("hi1");

            if (!user) {
                throw new Error('User not found');
            }
            console.log("hi2");

            user.password = newPassword;
            console.log("hi3");

            await user.save();
            console.log("hi4");

    
            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async editUserInfo(id: string, userInfoDTO:userInfoDTO) {
        try {
            const user = await this.userAuthModel.findById(id);
    
            if (!user) {
                throw new Error("User not found");
            }
    
            if (userInfoDTO.firstName) {
                user.firstName = userInfoDTO.firstName;
            }
            if (userInfoDTO.lastName) {
                user.lastName = userInfoDTO.lastName;
            }
            if (userInfoDTO.email) {
                user.email = userInfoDTO.email;
            }
            if (userInfoDTO.username) {
                user.username = userInfoDTO.username;
            }
            if (userInfoDTO.phoneNum) {
                user.phoneNum = userInfoDTO.phoneNum;
            }
            if (userInfoDTO.company) {
                user.company = userInfoDTO.company;
            }
            if (userInfoDTO.address) {
                user.address = userInfoDTO.address;
            }
            await user.save();
            return { success: true, message: "User information updated successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };
    async forgetPassword(email: string) {
        try {
            // Find the user by email
            const user = await this.userAuthModel.findOne({ email });
            
            // If user not found, throw error
            if (!user) {
                throw new Error("User not found");
            }

            // Generate reset password token
            const resetPasswordToken = this.generateSecureToken();

            // Save the reset password token in the user document
            user.resetPasswordToken = resetPasswordToken;
            await user.save();

            // Send reset password email with the same token
            await this.emailService.sendResetPasswordEmail(email, resetPasswordToken);

            return { success: true, message: "Reset password email sent successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async forgetPasswordT(resetPasswordToken: string, newPassword: string) {
        try {
            // Verify token and get user
            const user = await this.verifyTokenAndGetUser(resetPasswordToken);

            // If user not found or token is invalid, throw error
            if (!user) {
                throw new Error("Invalid or expired token");
            }

            // Update user's password
            user.password = newPassword;
            await user.save();

            return { success: true, message: "Password reset successfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    private async verifyTokenAndGetUser(resetPasswordToken: string) {
        // Find user by resetPasswordToken
        return await this.userAuthModel.findOne({ resetPasswordToken });
    }

    private generateSecureToken(): string {
        return crypto.randomBytes(20).toString('hex');
    }
}