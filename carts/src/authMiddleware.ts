import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
 import {JwtPayload} from './jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
      if (!token) throw new Error('Authentication token not found');

      const decoded = jwt.verify(token, 'your_secrect_key') as JwtPayload;
      req.user = { id: decoded.userId }; // Ensure your token includes the userId when it's issued by the user-auth service
      next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
