import express, { Request, Response, NextFunction } from 'express';
import StructuresController from '@/controllers/structure/structures.controller'
import NewStructureController from '@/controllers/structure/new-structure.controller'
import EditStructureController from '@/controllers/structure/edit-structure.controller'
import StructureController from '@/controllers/structure/structure.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, code } = req.query as {userId: string, projectId: string, code: string};

        const data = await StructuresController({
            userId,
            projectId,
            code
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
        let { id, name, code, bricks } = req.body;

        if (id !== req.params.id) {
            throw new Error('Structure ID error');
        }

        const data = await EditStructureController({
            userId,
            projectId,
            id,
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