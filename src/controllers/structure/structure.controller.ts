import Structure from '@/models/structure.model'
import { TErrorResponse, TStructureOutput } from '@/types/types'

export default async function StructureController(
    {userId, projectId, id}: 
    {userId: string, projectId: string, id: string}
    ): Promise<TErrorResponse | {structure: TStructureOutput}> {
    try {
        const structure = await Structure.findOne({_id: id, userId, projectId});
        if (!structure) {
            return {error: 'invalid_structure'};
        }

        const output = {
            id: structure.id,
            name: structure.name,
            code: structure.code
        };

        return {structure: output};
    } catch (error) {
        throw error;
    }
}