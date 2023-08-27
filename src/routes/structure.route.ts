import express, { Request, Response, NextFunction } from 'express';
import StructuresController from '@/controllers/structure/structures.controller'
import NewStructureController from '@/controllers/structure/new-structure.controller'
import EditStructureController from '@/controllers/structure/edit-structure.controller'
import StructureController from '@/controllers/structure/structure.controller'

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals;

        const data = await StructuresController({
            userId,
            projectId
        });

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
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

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = res.locals;
        let { id, name, code, bricks } = req.body;

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
        res.json({error: 'error'});
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

        res.json(data);
    } catch (e) {
        res.json({error: 'error'});
    }
});


export default router;