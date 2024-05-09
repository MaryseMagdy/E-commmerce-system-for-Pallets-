import { Connection } from 'mongoose';
import {ProductSchema} from "../schemas/product.schema"
export const productProvider = [
  {
    provide: 'product_Model',
    useFactory: (connection: Connection) => connection.model('product', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];