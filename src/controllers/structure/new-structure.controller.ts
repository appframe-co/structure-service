import Structure from '@/models/structure.model';
import { TStructureInput, TStructure, TBrick, TStructureModel } from '@/types/types';
import { validateArray } from '@/utils/validators/array.validator';
import { validateBoolean } from '@/utils/validators/boolean.validator';
import { validateNumber } from '@/utils/validators/number.validator';
import { validateString } from '@/utils/validators/string.validator';

function isErrorStructure(data: null|TStructureModel): data is null {
    return (data as null) === null;
}

export default async function CreateStructure(structureInput: TStructureInput): Promise<{structure: TStructure|null, userErrors: any}> {
    try {
        const {userId, projectId, ...structureBody} = structureInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId required');
        }

        const {errors: errorsForm, data: validatedData} = await (async (data) => {
            try {
                const errors: any = [];
                const output: any = {};

                output.structure = await (async function() {
                    const structure: any = {};

                    const {name} = data;
                    const [errorsName, valueName] = validateString(name, {required: true, min: 3, max: 255});
                    if (errorsName.length > 0) {
                        errors.push({field: ['name'], message: errorsName[0]}); 
                    }
                    structure.name = valueName;

                    const {code} = data;
                    const [errorsCode, valueCode] = validateString(code, {
                        required: true,
                        min: 3,
                        max: 255,
                        regex: [
                            new RegExp('^[a-z0-9\-_]+$'),
                            "Code can’t include spaces or special characters (i.e. $ # !)"
                        ]
                    });
                    if (errorsCode.length > 0) {
                        errors.push({field: ['code'], message: errorsCode[0]}); 
                    }
                    structure.code = valueCode;

                    const {bricks} = data;
                    const [errorsBricks, valueBricks] = validateArray(bricks, {required: true, max: 10});
                    if (errorsBricks.length > 0) {
                        errors.push({field: ['bricks'], message: errorsBricks[0]});
                    }
                    structure.bricks = valueBricks.map((v:any, k:number) => {
                        const {type, name, key, description, validations} = v;

                        const [errorsType, valueType] = validateString(type,
                            {required: true, choices: [[
                                'single_line_text', 'multi_line_text',
                                'number_integer', 'number_decimal', 'boolean',
                                'file_reference',
                                'list.single_line_text', 'list.file_reference'
                            ]]}
                        );
                        if (errorsType.length > 0) {
                            errors.push({field: ['bricks', k, 'type'], message: errorsType[0]});
                        }

                        const [errorsName, valueName] = validateString(name, {required: true, max: 255});
                        if (errorsName.length > 0) {
                            errors.push({field: ['bricks', k, 'name'], message: errorsName[0]}); 
                        }

                        const [errorsKey, valueKey] = validateString(key, {
                            required: true, 
                            min: 3,
                            max: 64,
                            regex: [
                                new RegExp('^[a-z0-9\-_]+$'),
                                "Key can’t include spaces or special characters (i.e. $ # !)"
                            ]
                        });
                        if (errorsKey.length > 0) {
                            errors.push({field: ['bricks', k, 'key'], message: errorsKey[0]}); 
                        }

                        const [errorsDescription, valueDescription] = validateString(description, {max: 100});
                        if (errorsDescription.length > 0) {
                            errors.push({field: ['bricks', k, 'description'], message: errorsDescription[0]}); 
                        }

                        const validatedValidations = validations.map((v:any, j:number) => {
                            const {code, value} = v;

                            const codes = ['required', 'choices', 'max', 'min', 'regex', 'max_precision'];
    
                            const [errorsCode, valueCode] = validateString(code,{required: true, choices: [codes]});
                            if (errorsCode.length > 0) {
                                errors.push({field: ['bricks', k, 'validations', j, 'code'], message: errorsCode[0]});
                            }
                            
                            const [errorsValue, valueValue] = (function() {
                                if (valueCode === 'required') {
                                    return validateBoolean(value, {max: 255});
                                }
                                if (valueCode === 'min') {
                                    return validateNumber(value, {min: [0, "Validations contains an invalid value: 'min' must be positive."]});
                                }
                                if (valueCode === 'max') {
                                    return validateNumber(value, {min: [0, "Validations contains an invalid value: 'max' must be positive."]});
                                }
                                if (valueCode === 'max_precision') {
                                    return validateNumber(value, {
                                        max: [9, "Validations 'max_precision' can't exceed the precision of 9."], 
                                        min: [0, "Validations 'max_precision' can't be a negative number."]
                                    });
                                }
                                if (valueCode === 'regex') {
                                    return validateString(value, {max: 255});
                                }
                                if (valueCode === 'choices') {
                                    return validateArray(value, {
                                        unique: [true, "Validations has duplicate choices."], 
                                        max: [5, "Validations contains a lot of choices."],
                                        value: ['string', {
                                            max: [255, "Validations contains an invalid value."]
                                        }]
                                    });
                                }

                                return [[], null];
                            }());
                            if (errorsValue.length > 0) {
                                if (valueCode === 'choices') {
                                    for (let i=0; i < errorsValue.length; i++) {
                                        if (!errorsValue[i]) {
                                            continue;
                                        }
                                        errors.push({field: ['bricks', k, 'validations', j, 'value', i], message: errorsValue[i]}); 
                                    }
                                } else {
                                    errors.push({field: ['bricks', k, 'validations', j, 'value'], message: errorsValue[0]}); 
                                }
                            }

                            return {
                                code: valueCode,
                                value: valueValue,
                            };
                        });

                        return {
                            type: valueType,
                            name: valueName,
                            key: valueKey,
                            description: valueDescription,
                            validations: validatedValidations
                        };
                    });

                    return structure;
                }());

                return {errors, data: output};
            } catch (e) {
                let message = 'Error';
                if (e instanceof Error) {
                    message = e.message;
                }

                return {errors: [{message}]};
            }
        })(structureBody);
        if (Object.keys(errorsForm).length > 0) {
            return {
                structure: null,
                userErrors: errorsForm
            };
        }

        const {errors: errorsDB, data: savedData} = await (async (data) => {
            try {
                const errors: any = [];
                const output: any = {};

                const structure: TStructureModel|null = await Structure.create({
                    userId, 
                    projectId, 
                    ...data.structure
                });
                if (isErrorStructure(structure)) {
                    throw new Error('invalid structure');
                }

                const {id: structureId} = structure;
                output.structureId = structureId;

                if (errors.length > 0) {
                    return {errors};
                }

                return {errors, data: output};
            } catch (e) {
                let message;
                if (e instanceof Error) {
                    message = e.message;
                }
                return {errors: [{message}]};
            }
        })(validatedData);
        if (Object.keys(errorsDB).length > 0) {
            return {
                structure: null,
                userErrors: errorsDB
            }
        }

        const {errors: errorsRes, data: obtainedData} = await (async (data): Promise<{errors: any, data: {structure: TStructure|null}}> => {
            try {
                const errors: any = [];
                let output: {structure: TStructure|null} = {structure: null};

                const {structureId} = data;

                const structure: TStructureModel|null = await Structure.findOne({userId, projectId, _id: structureId});
                if (isErrorStructure(structure)) {
                    output.structure = null;
                } else {
                    output.structure = {
                        id: structure.id, 
                        name: structure.name, 
                        code: structure.code,
                        bricks: structure.bricks.map((brick: TBrick) => ({
                            id: brick.id,
                            type: brick.type,
                            name: brick.name,
                            key: brick.key,
                            description: brick.description,
                            validations: brick.validations.map(v => ({
                                code: v.code,
                                value: v.value
                            })),
                        }))
                    }
                }

                return {errors, data: output};
            } catch (e) {
                let message;
                if (e instanceof Error) {
                    message = e.message;
                }
                return {errors: [{message}], data: {structure: null}};
            }
        })(savedData);
        if (Object.keys(errorsRes).length > 0) {
            return {
                structure: null,
                userErrors: errorsRes
            }
        }

        return {
            structure: obtainedData.structure,
            userErrors: []
        };
    } catch (e) {
        let message;
        if (e instanceof Error) {
            message = e.message;
        }
        return {
            structure: null,
            userErrors: [{message}]
        };
    }
}