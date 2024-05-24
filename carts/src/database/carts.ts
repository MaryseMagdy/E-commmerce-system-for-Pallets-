import { Connection } from 'mongoose';
import {CartSchema} from "../schemas/carts.schema";

export const cartsprovider = [
  {
    provide: 'carts_Model',
    useFactory: (connection: Connection) => connection.model('carts', CartSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
