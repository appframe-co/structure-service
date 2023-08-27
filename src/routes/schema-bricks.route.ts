import express, { Request, Response, NextFunction } from 'express';
import SchemaBricksController from '@/controllers/schema-brick/schema-bricks.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await SchemaBricksController();

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

export default router;