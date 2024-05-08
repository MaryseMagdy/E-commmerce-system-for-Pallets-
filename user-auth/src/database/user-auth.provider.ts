import { Connection } from 'mongoose';
import { UserAuthSchema } from '../schemas/users.schema';

export const userAuthprovider = [
  {
    provide: 'userAuth_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserAuthSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
