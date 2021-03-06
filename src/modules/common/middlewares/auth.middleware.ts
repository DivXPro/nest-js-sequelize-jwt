'use strict';

import { Middleware, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { MessageCodeError } from '../lib/error/MessageCodeError';
import { User } from '../../common/models/User';

@Middleware()
export class AuthMiddleware implements NestMiddleware {
    resolve () {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
                let token = (req.headers.authorization as string).split(' ')[1];
                const decoded: any = jwt.verify(token, process.env.JWT_KEY || '');
                const user = await User.findOne<User>({
                    where: {
                        id: decoded.id,
                        mail: decoded.email
                    }
                });
                if (!user) throw new MessageCodeError('request:unauthorized');
                next();
            } else {
                throw new MessageCodeError('request:unauthorized');
            }
        };
    }
}
