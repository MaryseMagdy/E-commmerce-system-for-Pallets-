import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { userAuth } from './interfaces/userAuth';
import { UserDTO } from './dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { addToFavouritesDTO } from './dto/addToFavourites.dto';
import{ userInfoDTO } from './dto/userInfo.dto';
import { AddressDto } from '../src/dto/addAddress.dto'; 
import { ViewUserReview } from './dto/viewUserReview.dto';
import { ViewAllProductReview } from './dto/viewAllProductReview.dto';
import { Reviews } from './dto/reviews.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { EmailService } from './email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MessagePattern } from '@nestjs/microservices';
// import {productModel} from '../../product/src/app.service'

@Injectable()
export class userAuthService {     
    constructor(
        @Inject('userAuth_MODEL') private userAuthModel: Model<userAuth>,
        private jwtService: JwtService,
        private emailService: EmailService
    ) {}
      
    async register(userDTO: UserDTO) {
        try {
            if (userDTO.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            if (userDTO.password === userDTO.username || userDTO.password === userDTO.email) {
                throw new Error('Password must not be the same as the username or email');
            }
            const hashedPassword = await bcrypt.hash(userDTO.password, 10); // 10 is the salt rounds
            const newUser = await this.userAuthModel.create({ ...userDTO, password: hashedPassword });
            const registerToken = this.generateSecureToken();
            newUser.registerToken = registerToken;
            await newUser.save();

            const verificationLink = `http://localhost:3000/user/verifyUser/${registerToken}`;
            await this.emailService.sendRegistrationEmail(newUser.email, verificationLink);

            return { success: true, message: "Registration successful. Please check your email for verification." };
        } catch (error) {
            throw new Error('Failed to register user: ' + (error as Error).message);
        }
}

    
    async verifyUser(token: string): Promise<void> {
        try {
            const user = await this.userAuthModel.findOne({ registerToken: token });
    
            if (!user) {
                throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
            }
    
            user.registerToken = undefined;
            await user.save();
        } catch (error) {
            throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
        }
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
            if (!user || !user.email || !user.password) {
                throw new Error("Invalid user data");
            }
            const existingUser = await this.userAuthModel.findOne({ email: user.email });
            if (!existingUser) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
    
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            const payload = {
                id: existingUser._id,
                email: existingUser.email,
                username: existingUser.username
            };
    
            const token = this.jwtService.sign(payload);
            const tokenDecoded: any = this.jwtService.decode(token);
    
            return {
                success: true,
                access_token: token,
                expires_in: tokenDecoded.exp,
                user_id: existingUser._id 
            };
        } catch (error) {
            return {
                success: false,
                message: (error as Error).message
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

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        try {
            const user = await this.userAuthModel.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Invalid current password');
            }

            if (currentPassword === newPassword) {
                throw new Error('New password must be different from the old password');
            }

            if (newPassword.length < 8) {
                throw new Error('New password must be at least 8 characters long');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10); 

            user.password = hashedPassword;

            await user.save();

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message:  (error as Error).message };
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
           
            await user.save();
        } catch (error) {
            return { success: false,message : (error as Error).message };
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
    
            // Construct reset password link
            const resetPasswordLink = `http://localhost:3000/forget-password/${resetPasswordToken}`;
    
            // Send reset password email with the reset password link
            await this.emailService.sendResetPasswordEmail(email, resetPasswordLink);
    
            return { success: true, message: "Reset password email sent successfully" };
        } catch (error) {
            return { success: false, message:+ (error as Error).message };
        }
    }
    
    async forgetPasswordT(resetPasswordToken: string, newPassword: string) {
        try {
            const user = await this.verifyTokenAndGetUser(resetPasswordToken);
    
            if (!user) {
                throw new Error("Invalid or expired token");
            }
    
            if (newPassword.length < 8) {
                throw new Error('New password must be at least 8 characters long');
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10); 
    
            user.password = hashedPassword;
            await user.save();
    
            return { success: true, message: "Password reset successfully" };
        } catch (error) {
            return { success: false, message: (error as Error).message };
        }
    }
      
    async addAddress(userId: string, addressDto: AddressDto) {
        try {
            console.log(userId);
            console.log("hi");
            console.log(addressDto);
            console.log("h2i");
            const user = await this.userAuthModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
    
            const address = {
                label: addressDto.label,
                street: addressDto.street,
                city: addressDto.city,
                state: addressDto.state,
                zip: addressDto.zip
            };
    
            user.address.push(address);
            await user.save();
            return { success: true, message: 'Address added successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async deleteAddress(userId: string, index: number) {
        try {
            const user = await this.userAuthModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            
            if (index >= user.address.length || index < 0) {
                throw new Error("Invalid address index");
            }

            user.address.splice(index, 1);
            await user.save();
            return { success: true, message: 'Address deleted successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

  
    async addToFavourites(userId: string, productId: mongoose.Types.ObjectId) {
        try {
            const user = await this.userAuthModel.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return { success: false, message: 'Invalid product ID' };
            }

            // const productExists = await productModel.findById(productId);
            // if (!productExists) {
            //     return { success: false, message: 'Product not found' };
            // }

            if (!user.favourite.includes(productId)) {
                user.favourite.push(productId);
                await user.save();
                return { success: true, message: 'Product added to favorites successfully' };
            } else {
                return { success: false, message: 'Product already in favorites' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    private async verifyTokenAndGetUser(resetPasswordToken: string) {
        return await this.userAuthModel.findOne({ resetPasswordToken });
    }
    private generateSecureToken(): string {
        return crypto.randomBytes(20).toString('hex');
    }

    async editUserAddress(userId: string, addressIndex: number, addressDto: AddressDto) {
        try {
            const user = await this.userAuthModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
    
            // Check if the address index is valid
            if (addressIndex < 0 || addressIndex >= user.address.length) {
                throw new Error("Address not found");
            }
    
            // Update the address with new data
            const address = user.address[addressIndex];
            address.label = addressDto.label ?? address.label;
            address.street = addressDto.street ?? address.street;
            address.city = addressDto.city ?? address.city;
            address.state = addressDto.state ?? address.state;
            address.zip = addressDto.zip ?? address.zip;
    
            await user.save();
            return { success: true, message: 'Address updated successfully', address: user.address[addressIndex] };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

  // -------------AMR-----------------------------

  async getUserAddresses(userId: string) {
    try {
        const user = await this.userAuthModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.address) {
            throw new Error("No addresses found");
        }
        return { success: true, addresses: user.address };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
  async createReview(userId: string, reviewData: Reviews) {
    const user = await this.userAuthModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (!mongoose.Types.ObjectId.isValid(reviewData.productId)) {
        throw new Error('Invalid productId');
    }

    const review = {
        userId: user._id, 
        productId: new mongoose.Types.ObjectId(reviewData.productId), 
        content: reviewData.content,
        rating: reviewData.rating,
    };

    user.reviews.push(review);
    await user.save();
    return user.reviews[user.reviews.length - 1]; // Return the last review
    }   
  async viewUserReviews(userId: string) {
    const user = await this.userAuthModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }else{

        return user.reviews;
    }
  }
  
  async deleteReview(userId: string, reviewId: string) {
    const user = await this.userAuthModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const reviews: any[] = user.reviews;
    const reviewIndex = reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
        throw new Error('Review not found');
    }

    user.reviews.splice(reviewIndex, 1);
    await user.save();
    return { message: 'Review deleted successfully' };
    }
    async editReview(userId: string, reviewId: string, updateData: { content?: string, rating?: number }) {
        const user = await this.userAuthModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const reviews: any[] = user.reviews;
        const review = reviews.find(r => r._id.toString() === reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        if (updateData.content) {
            review.content = updateData.content;
        }
        if (updateData.rating) {
            review.rating = updateData.rating;
        }
        await user.save();
        return review;
    }


}