import Structure from '@/models/structure.model';
import {TErrorResponse, TStructure, TSort, TParameters, TStructureModel} from '@/types/types';

type TStructuresInput = {
    userId: string;
    projectId: string;
}
type TStructuresFilter = {
    userId: string;
    projectId: string;
    code?: string;
}

export default async function Structures(structureInput: TStructuresInput, parameters: TParameters = {}): Promise<TErrorResponse | {structures: TStructure[]}> {
    try {
        const {userId, projectId} = structureInput;

        if (!userId || !projectId) {
            throw new Error('createdBy & projectId query required');
        }

        const sort: TSort = {};
        const defaultLimit = 10;
        const filter: TStructuresFilter = {userId, projectId};
        let {limit=defaultLimit, code} = parameters;

        if (limit > 250) {
            limit = defaultLimit;
        }
        if (code) {
            filter.code = code;
        }

        sort['_id'] = 'asc';

        const structures: TStructureModel[] = await Structure.find(filter).limit(limit).sort(sort);
        if (!structures) {
            throw new Error('invalid structure');
        }

        const output = structures.map(structure => ({
            id: structure.id,
            name: structure.name,
            code: structure.code,
            bricks: structure.bricks.map(brick => ({
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