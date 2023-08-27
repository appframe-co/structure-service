import { Request, Response, NextFunction } from 'express';
import { RoutesInput } from '@/types/types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import structure from './structure.route'
import schemabricks from './schema-bricks.route'

type CustomJwtPayload = JwtPayload & { userId: string, projectId: string };

export default ({ app }: RoutesInput) => {
    app.use(async function (req: Request, res: Response, next: NextFunction): Promise<void| Response> {
        try {
            const {authorization: accessToken} = req.headers;

            if (!accessToken) {
                return res.status(401).json({message: 'Invalid token'});
            }

            const {userId, projectId} = jwt.verify(accessToken, process.env.JWT_SECRET as string) as CustomJwtPayload;
            if (!userId || !projectId) {
                return res.status(401).json({message: 'Invalid token'});
            }

            res.locals.userId = userId;
            res.locals.projectId = projectId;

            next();
        } catch(err) {
            next(err);
        }
    });

    app.use('/api/structures', structure);
    app.use('/api/schema_bricks', schemabricks);
};