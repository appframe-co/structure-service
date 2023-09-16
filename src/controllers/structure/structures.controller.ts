import Structure from '@/models/structure.model';
import {TErrorResponse, TStructure, TBrick} from '@/types/types';

export default async function Structures(
    {userId, projectId, code}: {userId: string, projectId: string, code: string}): 
    Promise<TErrorResponse | {structures: TStructure[]}>
    {
    try {
        const filter: {userId: string, projectId: string, code?: string} = {userId, projectId};

        if (code) {
            filter.code = code;
        }

        const structures = await Structure.find(filter);
        if (!structures) {
            throw new Error('invalid structure');
        }

        const output = structures.map((structure: TStructure)  => ({
            id: structure.id,
            name: structure.name,
            code: structure.code,
            bricks: structure.bricks.map((brick: TBrick) => ({
                type: brick.type,
                name: brick.name,
                key: brick.key,
                description: brick.description,
                validations: brick.validations.map(v => ({
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