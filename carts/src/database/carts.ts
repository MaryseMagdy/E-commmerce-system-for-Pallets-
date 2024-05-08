import { Connection } from 'mongoose';
import {CartsSchema} from "../schemas/carts.schema";

export const cartssprovider = [
  {
    provide: 'carts_Model',
    useFactory: (connection: Connection) => connection.model('carts', CartsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
