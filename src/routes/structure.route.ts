import express, { Request, Response, NextFunction } from 'express';
import StructuresController from '@/controllers/structure/structures.controller'
import NewStructureController from '@/controllers/structure/new-structure.controller'
import StructureController from '@/controllers/structure/structure.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals;

        const data = await StructuresController({
            userId,
            projectId
        });

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals;
        let { name, code } = req.body;

        const data = await NewStructureController({
            userId,
            projectId,
            name,
            code
        });

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId, projectId} = res.locals;
        const {id} = req.params;

        const data = await StructureController({
            userId,
            projectId,
            id
        });

        const response = {
            status: 200,
            data,
            message: null
        };
        res.json(response);
    } catch (e) {
        res.json({
            data: {error: 'error'}
        });
    }
});


export default router;