import Structure from '@/models/structure.model';
import { TErrorResponse, TStructureInput, TStructure, TBrick } from '@/types/types';

export default async function UpdateStructure(
    {userId, projectId, id, name, code, bricks}: 
    TStructureInput&{id:string}): Promise<TErrorResponse | {structure: TStructure}> {
    try {
        if (!id) {
            return {error: 'invalid_request'};
        }

        if (name) {
            name = name.trim();
            if (name.length < 1 || name.length > 40) {
                return {error: 'invalid_request', description: 'Number of characters from 4 to 20.', property: 'name'};
            }
        }

        if (code) {
            code = code.trim();
            if (code.length < 1 || code.length > 40) {
                return {error: 'invalid_request', description: 'Number of characters from 4 to 20.', property: 'code'};
            }
        }

        const structure: TStructure|null  = await Structure.findOneAndUpdate({
            userId, 
            projectId, 
            _id: id
        }, {name, code, bricks});
        if (!structure) {
            throw new Error('invalid structure');
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