import express, { Request, Response, NextFunction } from 'express';
import StructuresController from '@/controllers/structure/structures.controller'
import NewStructureController from '@/controllers/structure/new-structure.controller'
import EditStructureController from '@/controllers/structure/edit-structure.controller'
import StructureController from '@/controllers/structure/structure.controller'
import CountStructureController from '@/controllers/structure/count-structures.controller'
import { TParameters } from '@/types/types';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, code, limit } = req.query as {userId: string, projectId: string, code: string, limit: string};

        const parameters: TParameters = {};
        if (limit) {
            parameters.limit = +limit;
        }
        if (code) {
            parameters.code = code;
        }

        const data = await StructuresController({
            userId,
            projectId
        }, parameters);

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};

        const data = await CountStructureController({
            userId,
            projectId
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        let { name, code, bricks } = req.body;

        const data = await NewStructureController({
            userId,
            projectId,
            name,
            code,
            bricks
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        let { id, name, code, bricks, notifications } = req.body;

        if (id !== req.params.id) {
            throw new Error('Structure ID error');
        }

        const data = await EditStructureController({
            userId,
            projectId,
            id,
            name,
            code,
            bricks,
            notifications
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.query as {userId: string, projectId: string};
        const {id} = req.params;

        const data = await StructureController({
            userId,
            projectId,
            id
        });

        res.json(data);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message; 
        }

        res.json({error: 'server_error', description: message});
    }
});

export default router;