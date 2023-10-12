import Structure from '@/models/structure.model'
import { TErrorResponse, TStructure, TBrick, TStructureModel } from '@/types/types'

export default async function StructureController(
    {userId, projectId, id}: 
    {userId: string, projectId: string, id: string}
    ): Promise<TErrorResponse | {structure: TStructure}> {
    try {
        const structure: TStructureModel|null = await Structure.findOne({_id: id, userId, projectId});
        if (!structure) {
            throw new Error('invalid structure');
        }

        const output = {
            id: structure.id,
            name: structure.name,
            code: structure.code,
            bricks: structure.bricks.map((brick: TBrick) => ({
                id: brick.id,
                type: brick.type,
                name: brick.name,
                key: brick.key,
                description: brick.description,
                validations: brick.validations.map(v => ({
                    type: v.type,
                    code: v.code,
                    value: v.value
                })),
            })),
            notifications: structure.notifications
        };

        return {structure: output};
    } catch (error) {
        throw error;
    }
}