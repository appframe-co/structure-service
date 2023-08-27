import Structure from '@/models/structure.model'
import { TErrorResponse, TStructure, TBrick } from '@/types/types'

export default async function StructureController(
    {userId, projectId, id}: 
    {userId: string, projectId: string, id: string}
    ): Promise<TErrorResponse | {structure: TStructure}> {
    try {
        const structure = await Structure.findOne({_id: id, userId, projectId});
        if (!structure) {
            return {error: 'invalid_structure'};
        }

        const output = {
            id: structure.id,
            name: structure.name,
            code: structure.code,
            bricks: structure.bricks.map((brick: TBrick) => ({
                type: brick.type,
                name: brick.name,
                code: brick.code,
                validation: brick.validation.map(v => ({
                    code: v.code,
                    value: v.value
                })),
            }))
        };

        return {structure: output};
    } catch (error) {
        throw error;
    }
}