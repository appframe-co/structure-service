import Structure from '@/models/structure.model'
import { TErrorResponse, TStructureInput } from '@/types/types'

export default async function CreateStructure({userId, projectId, name, code}: TStructureInput): Promise<TErrorResponse | {id: string}> {
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

        const newStructure = await Structure.create({
            userId, 
            projectId, 
            name,
            code
        });
        if (!newStructure) {
            return {error: 'invalid_structure'};
        }

        return {id: newStructure.id};
    } catch (error) {
        throw error;
    }
}