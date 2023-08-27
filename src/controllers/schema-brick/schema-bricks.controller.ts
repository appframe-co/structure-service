import SchemaBrick from '@/models/schema-brick.model'
import {TErrorResponse, TSchemaBrick, TSchemaBrickOutput} from '@/types/types'

export default async function SchemaBricks(): Promise<TErrorResponse | {schemaBricks: TSchemaBrickOutput[]}> {
    try {
        const schemaBricks = await SchemaBrick.find({});
        if (!schemaBricks) {
            return {error: 'invalid_schemaBricks'};
        }

        const output = schemaBricks.map((schemaBrick: TSchemaBrick)  => ({
            id: schemaBrick.id,
            type: schemaBrick.type,
            name: schemaBrick.name,
            code: schemaBrick.code,
            icon: schemaBrick.icon,
            validation: schemaBrick.validation.map(v => ({
                code: v.code,
                name: v.name,
                value: v.value
            }))
        }));

        return {schemaBricks: output};
    } catch (error) {
        throw error;
    }
}