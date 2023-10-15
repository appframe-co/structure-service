import SchemaBrick from '@/models/schema-brick.model'
import {TErrorResponse, TSchemaBrick, TSchemaBrickOutput} from '@/types/types'

export default async function SchemaBricks(): Promise<TErrorResponse | {schemaBricks: TSchemaBrickOutput[]}> {
    try {
        const schemaBricks = await SchemaBrick.find({});
        if (!schemaBricks) {
            throw new Error('invalid schema bricks');
        }

        const output = schemaBricks.map((schemaBrick: TSchemaBrick)  => ({
            id: schemaBrick.id,
            type: schemaBrick.type,
            name: schemaBrick.name,
            code: schemaBrick.code,
            icon: schemaBrick.icon,
            groupCode: schemaBrick.groupCode,
            list: schemaBrick.list,
            validationDescHtml: schemaBrick.validationDescHtml,
            validations: schemaBrick.validations.map(v => ({
                code: v.code,
                name: v.name,
                value: v.value,
                desc: v.desc,
                type: v.type,
                presetChoices: v.presetChoices
            }))
        }));

        return {schemaBricks: output};
    } catch (error) {
        throw error;
    }
}