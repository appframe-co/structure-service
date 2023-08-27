import Structure from '@/models/structure.model';
import {TErrorResponse, TStructure, TBrick} from '@/types/types';

export default async function Structures(
    {userId, projectId}: {userId: string, projectId: string}): 
    Promise<TErrorResponse | {structures: TStructure[]}>
    {
    try {
        const structures = await Structure.find({userId, projectId});
        if (!structures) {
            return {error: 'invalid_structure'};
        }

        const output = structures.map((structure: TStructure)  => ({
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
        }));

        return {structures: output};
    } catch (error) {
        throw error;
    }
}