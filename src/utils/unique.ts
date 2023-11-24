import { TStructureModel } from "@/types/types";
import Structure from '@/models/structure.model';

type TPayload = {
    projectId: string;
    structureId?: string;
    key: string;
}

export async function checkUnique(value: string|null, payload: TPayload): Promise<boolean|null> {
    try {
        const {projectId, structureId, key} = payload;

        if (!projectId || !key) {
            throw new Error('projectId & key is required');
        }

        const filter: {[key:string]: any} = {projectId, [key]: value};
        if (structureId) {
            filter['_id'] = {$ne: structureId};
        }
        const structure: TStructureModel|null = await Structure.findOne(filter);
        if (structure) {
            return false;
        }

        return true;
    } catch (e) {
        return null;
    }
}