import Structure from '@/models/structure.model'
import {TErrorResponse, TStructure, TStructureOutput} from '@/types/types'

export default async function Structures(
    {userId, projectId}: {userId: string, projectId: string}): 
    Promise<TErrorResponse | {structures: TStructureOutput[]}>
    {
    try {
        const structures = await Structure.find({userId, projectId});
        if (!structures) {
            return {error: 'invalid_structure'};
        }

        const output = structures.map((structure: TStructure)  => ({
            id: structure.id,
            name: structure.name
        }));

        return {structures: output};
    } catch (error) {
        throw error;
    }
}