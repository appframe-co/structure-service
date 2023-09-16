import Structure from '@/models/structure.model';
import { TErrorResponse, TStructureInput, TStructure, TBrick } from '@/types/types';

export default async function CreateStructure({userId, projectId, name, code, bricks}: TStructureInput): Promise<TErrorResponse | {structure: TStructure}> {
    try {
        if (!name || !code) {
            return {error: 'invalid_request'};
        }

        name = name.trim();
        if (name.length < 1 || name.length > 40) {
            return {error: 'invalid_request', description: 'Number of characters from 4 to 20.', property: 'name'};
        }

        code = code.trim();
        if (code.length < 1 || code.length > 40) {
            return {error: 'invalid_request', description: 'Number of characters from 4 to 20.', property: 'code'};
        }

        const structure: TStructure = await Structure.create({
            userId, 
            projectId, 
            name,
            code,
            bricks
        });
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
                key: brick.key,
                description: brick.description,
                validations: brick.validations.map(v => ({
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