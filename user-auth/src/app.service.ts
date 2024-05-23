import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { userAuth } from './interfaces/userAuth';
import { UserDTO } from './dto/create.user.dto';
import { LoginDto } from './dto/login.dto';
import { addToFavouritesDTO } from './dto/addToFavourites.dto';
import { userInfoDTO } from './dto/userInfo.dto';
import { Request, Response } from 'express';
import { AddressDto } from '../src/dto/addAddress.dto'; 
import { ViewUserReview } from './dto/viewUserReview.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { EmailService } from './email.service';
import * as crypto from 'crypto';
import { MessagePattern } from '@nestjs/microservices';
import { Reviews } from './dto/Reviews.dto';
import { Kafka } from 'kafkajs';
import { AddToWishlistDTO } from './dto/addToWishlist.dto';

@Injectable()
export class userAuthService {   
  private kafka: Kafka;
  private producer;
  private consumer;  

  constructor(
    @Inject('userAuth_MODEL') // Ensure the injection token is correct
    private readonly userAuthModel: Model<userAuth>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.kafka = new Kafka({
      clientId: 'user-auth',
      brokers: ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'user-auth-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    this.startConsumer();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async startConsumer() {
    await this.consumer.subscribe({ topic: 'product-details-response' });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        if (topic === 'product-details-response') {
            console.log('Received product details from Kafka:', data);
            await this.addToWishlistConsumer(data);
        }
      }
    });
  }

  async getProductDetailsFromKafka(userId: string, productId: string) {
    await this.producer.send({
      topic: 'get-product-details',
      messages: [{ value: JSON.stringify({ userId, productId }) }]
    });

    return new Promise((resolve, reject) => {
        this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());
                if (data._id === productId && data.userId === userId) {
                    resolve(data);
                }
            }
        });
    });
  }
  async addToWishlistConsumer(productDetails: any) {
    try {
      const userId = productDetails.userId;
      const user = await this.userAuthModel.findById(userId);
      if (!user) {
        console.log('User not found');
        return;
      }
  
      console.log(productDetails._id, "productDetails._id");
      console.log(user.wishlist, "user.wishlist");
  
      if (user.wishlist.some(product => product && product._id && product._id.toString() === productDetails._id.toString())) {
        console.log('Product already in wishlist');
        return;
      }
  
      user.wishlist.push(productDetails);
      await user.save();
  
      console.log('Product added to wishlist successfully');
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  }
  async getWishlist(userId: string): Promise<any> {
    try {
      const user = await this.userAuthModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, wishlist: user.wishlist };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
  async removeFromWishlist(userId: string, productId: string): Promise<any> {
    try {
      const user = await this.userAuthModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const initialWishlistLength = user.wishlist.length;
      user.wishlist = user.wishlist.filter(product => product._id.toString() !== productId);

      if (user.wishlist.length === initialWishlistLength) {
        return { success: false, message: 'Product not found in wishlist' };
      }

      await user.save();

      return { success: true, message: 'Product removed from wishlist successfully' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
  async addToWishlist(addToWishlistDTO: AddToWishlistDTO): Promise<any> {
    const { userId, productId } = addToWishlistDTO;
  
    try {
      const productDetails: any = await this.getProductDetailsFromKafka(userId, productId);
  
      const user = await this.userAuthModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
  
    //   if (user.wishlist.some(product => product && product._id && product._id.toString() === productDetails._id.toString())) {
    //     return { success: false, message: 'Product already in wishlist' };
    //   }
  
      user.wishlist.push(productDetails);
      await user.save();
  
      return { success: true, message: 'Product added to wishlist successfully' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
async rateProduct(userId: string, productId: string, rating: number) {
    console.log('Sending message with:', { userId, productId, rating }); // Add logging here
    await this.producer.send({
        topic: 'product-rating',
        messages: [
            { value: JSON.stringify({ userId, productId, rating }) }, // Ensure 'rating' key is used
        ],
    });
}


    async register(userDTO: UserDTO) {
        try {
            const newUser = await this.userAuthModel.create(userDTO);
            const registerToken = this.generateSecureToken();
            newUser.registerToken = registerToken;
            await newUser.save();

            const verificationLink = `http://localhost:3000/verify/${registerToken}`;
            await this.emailService.sendRegistrationEmail(newUser.email, verificationLink);

            return { success: true, message: "Registration successful. Please check your email for verification.", user: newUser};
        } catch (error) {
            throw new Error('Failed to register user: ' + (error as Error).message);
        }
    }

    async login(req: Request, res: Response, loginDto: LoginDto) {
        try {
            let loginResult = await this.userAuthModel.findOne({
                username: loginDto.username
            });
    
            if (loginResult === null) {
                res.status(401).json({ success: false, message: "User not found or password incorrect" });
                return;
            }
    
            let jsonData = loginResult.toObject();
            let { _id, ...userData } = jsonData;
    
            let payload = {
                sub: _id,
                username: userData.username
            };
    
            var token = this.jwtService.sign(payload);
    
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false, 
                path: '/',
                maxAge: 3 * 60 * 60 * 1000 // should match the token expiry
            });
    
            res.json({
                success: true,
                access_token: token,
                expires_in: 3 * 60 * 60,
                id: _id,
                ...userData
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: (error as Error).message
            });
        }
    }  
async validateUser(loginDto: LoginDto): Promise<{ user?: any, token?: string }> {
    const user = await this.userAuthModel.findOne({
        username: loginDto.username,
        password: loginDto.password,
    }).exec();
    console.log("user:", user);
    if (!user) {
        return {}; 
    }

    const payload = {
        userId: user._id,
        username: user.username
    };

    const token = this.jwtService.sign(payload);
    console.log("token:", token);
    return {
        user: {
            id: user._id,
            username: user.username,
            // Include other user details you need
        },
        token: token
    };
}
async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
        const user = await this.userAuthModel.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the current password matches the one stored (now directly without hashing)
        if (currentPassword !== user.password) {
            throw new Error('Invalid current password');
        }

        if (currentPassword === newPassword) {
            throw new Error('New password must be different from the old password');
        }

        if (newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
        }

        // Set the new password directly without hashing
        user.password = newPassword;

        await user.save();

        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}


    async verifyUser(token: string): Promise<void> {
        try {
            const user = await this.userAuthModel.findOne({ registerToken: token });
    
            if (!user) {
                throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
            }
    
            user.registerToken = '';
            await user.save();
        } catch (error) {
            throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
        }
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

    async editUserInfo(id: string, userInfoDTO: userInfoDTO) {
        try {
            const user = await this.userAuthModel.findById(id);
    
            if (!user) {
                throw new Error("User not found");
            }
    
            // Updating user information
            if (userInfoDTO.firstName) user.firstName = userInfoDTO.firstName;
            if (userInfoDTO.lastName) user.lastName = userInfoDTO.lastName;
            if (userInfoDTO.email) user.email = userInfoDTO.email;
            if (userInfoDTO.username) user.username = userInfoDTO.username;
            if (userInfoDTO.phoneNum) user.phoneNum = userInfoDTO.phoneNum;
            if (userInfoDTO.company) user.company = userInfoDTO.company;
           
            await user.save();
            return { success: true, message: 'User info updated successfully' };
        } catch (error) {
            return { success: false, message: (error as Error).message
            };
        }
    }
    async forgetPassword(email: string) {
        try {
            // Find the user by email
            const user = await this.userAuthModel.findOne({ email });
            
            // If user not found, throw error
            if (!user) {
                throw new Error("User not found");
            }
    
            // Generate reset password token
            const resetPasswordToken = this.generateSecurePIN();
    
            // Save the reset password token in the user document
            user.resetPasswordToken = resetPasswordToken;
            await user.save();
    
            // Construct reset password link
            const resetPasswordLink = `http://localhost:8001/forget-password/${resetPasswordToken}`;
    
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
            if (newPassword === user.password) {
                throw new Error('New password must be different from the old password');
            }
            
            user.password = newPassword;

            user.resetPasswordToken = "";
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
            return { success: false, message: (error as Error).message
            };
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
            return { success: false,  message: (error as Error).message };
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
            return { success: false, message: (error as Error).message };
        }
    }
    private async verifyTokenAndGetUser(resetPasswordToken: string) {
        return await this.userAuthModel.findOne({ resetPasswordToken });
    }
    private generateSecureToken(): string {
        return crypto.randomBytes(20).toString('hex');
    }
    private generateSecurePIN(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit PIN
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
    
            const address = user.address[addressIndex];
            address.label = addressDto.label ?? address.label;
            address.street = addressDto.street ?? address.street;
            address.city = addressDto.city ?? address.city;
            address.state = addressDto.state ?? address.state;
            address.zip = addressDto.zip ?? address.zip;
    
            await user.save();
            return { success: true, message: 'Address updated successfully', address: user.address[addressIndex] };
        } catch (error) {
            return { success: false, message: (error as Error).message };
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
        return { success: false,  message: (error as Error).message };
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
    async getUserById(userId: string) {
        try {
          const user = await this.userAuthModel.findById(userId);
          if (!user) {
            throw new Error('User not found');
          }
    
          const userDto = new userInfoDTO(
            // user.id,
            user.firstName,
            user.lastName,
            user.username,
            user.email,
            user.phoneNum,
            user.company,
            // user.address
          );
    
          return { success: true, user: userDto };
        } catch (error) {
            return { success: false, message: (error as Error).message };
        }
      }

}