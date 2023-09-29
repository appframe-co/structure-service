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

type TOutputStructure = TStructure & {entriesCount: number}

function isErrorEntryCount(data: TErrorResponse|{count:number}): data is TErrorResponse {
    return !!(data as TErrorResponse).error;
}

export default async function Structures(structureInput: TStructuresInput, parameters: TParameters = {}): Promise<TErrorResponse | {structures: TOutputStructure[]}> {
    try {
        const {userId, projectId} = structureInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId query required');
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

        const output = [];
        for (const structure of structures) {
            const resFetchEntryCount = await fetch(`${process.env.URL_ENTRY_SERVICE}/api/entries/count?userId=${userId}&projectId=${projectId}&structureId=${structure.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const entryCountFetch: {count: number}|TErrorResponse = await resFetchEntryCount.json();
            if (isErrorEntryCount(entryCountFetch)) {
                throw new Error('Error entry count');
            }

            output.push({
                id: structure.id,
                name: structure.name,
                code: structure.code,
                bricks: structure.bricks.map(brick => ({
                    id: brick.id,
                    type: brick.type,
                    name: brick.name,
                    key: brick.key,
                    description: brick.description,
                    validations: brick.validations.map(v => ({
                        type: v.type,
                        code: v.code,
                        value: v.value
                    })),
                })),
                entriesCount: entryCountFetch.count
            });
        }

        return {structures: output};
    } catch (error) {
        throw error;
    }
}