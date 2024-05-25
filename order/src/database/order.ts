
import { Connection } from 'mongoose';
import {OrderSchema} from "../schemas/order.schema"
export const orderprovider = [
  {
    provide: 'orders_Model',
    useFactory: (connection: Connection) => connection.model('order', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
    