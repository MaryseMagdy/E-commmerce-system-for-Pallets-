// order.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { order } from './interfaces/order';
import { Consumer, Producer, Kafka } from 'kafkajs';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
    private consumer: Consumer;
    private producer: Producer;

    constructor(
        @InjectModel('Order') private readonly OrderModel: Model<order>,     
    ) {
        const kafka = new Kafka({
            clientId: 'order-service',
            brokers: ['localhost:9092']
        });

        this.consumer = kafka.consumer({ groupId: 'order-group' });
        this.producer = kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'cart-data', fromBeginning: true });
        this.startConsumer();
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
        await this.producer.disconnect();
    }

    async startConsumer() {
        console.log("Order connected as consumer");

        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                try {
                    const messageValue = message.value.toString();
                    console.log(`Received raw message from ${topic} topic:`, messageValue);

                    const data = JSON.parse(message.value.toString());
                    console.log(`Parsed data from ${topic} topic:`, data);

                    if (topic === 'cart-data') {
                        const { userId, cartItems } = data;
                        console.log(`Received cart data for user ${userId}, cart:`, cartItems);

                        if (Array.isArray(cartItems) && cartItems.length > 0) {
                            console.log(`cartItems is an array with length: ${cartItems.length}`);
                            await this.placeOrder(userId, cartItems);
                        } else {
                            console.error("cartItems is not an array or is empty:", cartItems);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing message from ${topic} topic:`, error);
                }
            }
        });
    }

    async placeOrder(userId: string, cartItems: { productId: string; quantity: number; price: number; }[]) {
        const cartItemsArray = Array.isArray(cartItems) ? cartItems : convertObjectToArray(cartItems);

        const items = cartItemsArray.map(item => ({
            productId: item.productId ? new Types.ObjectId(item.productId) : undefined,
            quantity: item.quantity,
            price: item.price ?? 30,
        }));

        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const newOrder = new this.OrderModel({
            userId,
            items,
            date: new Date(),
            status: 'Placed',
            totalAmount
        });

        try {
            const savedOrder = await newOrder.save();
            console.log('Order placed successfully', savedOrder);

            // Ensure the order object is properly structured before sending to Kafka
            const orderMessage = {
                _id: savedOrder._id,
                userId: savedOrder._id,
                items: savedOrder.items.map(item => ({
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    price: item.price
                })),
                date: savedOrder.date,
                status: savedOrder.status,
                totalAmount: savedOrder.totalAmount
            };

            console.log('Producing message to Kafka:', JSON.stringify(orderMessage));

            // Produce a message to Kafka to notify the user-auth service
            await this.producer.send({
                topic: 'order-placed',
                messages: [
                    {
                        key: userId,
                        value: JSON.stringify({ userId, order: orderMessage })
                    }
                ]
            });

            return savedOrder;
        } catch (error) {
            console.error('Error placing order:', error);
            throw new Error('Failed to place order');
        }
    }
    async ViewPastOrders(userId: string): Promise<any[]> {
        try {
            if (!userId) {
                throw new Error('Not a registered user');
            }
    
            // Find all orders for the user
            const orders = await this.OrderModel.find({ userId: userId }).exec();
    
            // Extract items array from each order
            const itemsArray = orders.map(order => order.items).flat();
    
            return itemsArray;
            
        } catch (error) {
            console.error('Error fetching past orders', error);
            throw error;
        }
    }

    async getOrders(userId: string): Promise<order[]> {
        try {
            const orders = await this.OrderModel.find({ userId }).exec();
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }
}

function convertObjectToArray(obj: any): any[] {
    return Object.keys(obj).map(key => obj[key]);
}
