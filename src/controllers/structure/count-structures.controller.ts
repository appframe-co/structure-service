import Structure from '@/models/structure.model';
import {TErrorResponse, TParameters} from '@/types/types';

type TStructuresInput = {
    userId: string;
    projectId: string;
}
type TStructuresFilter = {
    userId: string;
    projectId: string;
    code?: string;
}

export default async function CountStructures(structureInput: TStructuresInput, parameters: TParameters = {}): Promise<TErrorResponse | {count: number}> {
    try {
        const {userId, projectId} = structureInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId query required');
        }

        const filter: TStructuresFilter = {userId, projectId};
        const count: number = await Structure.countDocuments(filter);

        return {count};
    } catch (error) {
        throw error;
    }
}