import Structure from '@/models/structure.model';
import { TStructureInput, TStructure, TBrick, TStructureModel } from '@/types/types';
import { validateArray } from '@/utils/validators/array.validator';
import { validateBoolean } from '@/utils/validators/boolean.validator';
import { validateDate } from '@/utils/validators/date.validator';
import { validateDateTime } from '@/utils/validators/datetime.validator';
import { validateNumber } from '@/utils/validators/number.validator';
import { validateString } from '@/utils/validators/string.validator';

function isErrorStructure(data: null|TStructureModel): data is null {
    return (data as null) === null;
}

export default async function UpdateStructure(structureInput: TStructureInput): Promise<{structure: TStructure|null, userErrors: any}> {
    try {
        const {userId, projectId, ...structureBody} = structureInput;

        if (!userId || !projectId) {
            throw new Error('userId & projectId required');
        }

        if (!structureBody.id) {
            throw new Error('Invalid structure id');
        }

        const structure = await Structure.findOne({_id: structureBody.id, userId, projectId});
        if (!structure) {
            throw new Error('Structure not found');
        }

        const structureId = structure.id;

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

                    const keys = valueBricks.map((v: any) => v.key);
                    structure.bricks = valueBricks.map((v:any, k:number) => {
                        const {type, name, key, description, validations} = v;

                        const [errorsType, valueType] = validateString(type,
                            {required: true, choices: [[
                                'single_line_text', 'multi_line_text',
                                'number_integer', 'number_decimal', 'boolean', 'money',
                                'date_time', 'date',
                                'file_reference',
                                'list.single_line_text', 'list.date_time', 'list.date', 'list.file_reference'
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
                        if (valueBricks.filter((v:any) => v.key === valueKey).length > 1) {
                            errors.push({field: ['bricks', k, 'key'], message: 'Value must be unique'});
                        }

                        const [errorsDescription, valueDescription] = validateString(description, {max: 100});
                        if (errorsDescription.length > 0) {
                            errors.push({field: ['bricks', k, 'description'], message: errorsDescription[0]}); 
                        }

                        const validatedValidations = validations.map((v:any, j:number) => {
                            const {code, value, type} = v;

                            const codes = ['required', 'choices', 'max', 'min', 'regex', 'max_precision'];
                            const [errorsCode, valueCode] = validateString(code, {required: true, choices: [codes]});
                            if (errorsCode.length > 0) {
                                errors.push({field: ['bricks', k, 'validations', j, 'code'], message: errorsCode[0]});
                            }

                            const types = ['checkbox', 'text', 'number', 'date_time', 'date', 'list.text'];
                            const [errorsType, valueType] = validateString(type, {required: true, choices: [types]});
                            if (errorsType.length > 0) {
                                errors.push({field: ['bricks', k, 'validations', j, 'type'], message: errorsType[0]});
                            }

                            const [errorsValue, valueValue] = (function() {
                                if (valueCode === 'required') {
                                    return validateBoolean(value, {max: 255});
                                }
                                if (valueCode === 'min') {
                                    if (v.type === 'date_time') {
                                        return validateDateTime(value);
                                    }
                                    if (v.type === 'date') {
                                        return validateDate(value);
                                    }
                                    return validateNumber(value, {min: [0, "Validations contains an invalid value: 'min' must be positive."]});
                                }
                                if (valueCode === 'max') {
                                    if (v.type === 'date_time') {
                                        return validateDateTime(value);
                                    }
                                    if (v.type === 'date') {
                                        return validateDate(value);
                                    }
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
                                type: valueType,
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

                    const {notifications} = data;
                    if (notifications) {
                        const [errorsNewAlertEnabled, valueNewAlertEnabled] = validateBoolean(notifications.new.alert.enabled || false);
                        if (errorsNewAlertEnabled.length > 0) {
                            errors.push({field: ['notifications', 'new', 'alert', 'enabled'], message: errorsNewAlertEnabled[0]}); 
                        }
    
                        const [errorsNewAlertMessage, valueNewAlertMessage] = validateString(notifications.new.alert.message || '');
                        if (errorsNewAlertMessage.length > 0) {
                            errors.push({field: ['notifications', 'new', 'alert', 'message'], message: errorsNewAlertMessage[0]});
                        }
    
                        structure['notifications'] = {
                            new: {
                                alert: {
                                    enabled: valueNewAlertEnabled,
                                    message: valueNewAlertMessage
                                }
                            }
                        };
                    }

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

        const {errors: errorsDB, data: savedData} = await (async (data, payload) => {
            try {
                const {structureId} = payload;

                const errors: any = [];
                const output: any = {structureId};

                const structure: TStructureModel|null = await Structure.findOneAndUpdate({
                    userId, 
                    projectId, 
                    _id: structureId
                }, {...data.structure});
                if (isErrorStructure(structure)) {
                    throw new Error('invalid structure');
                }

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
        })(validatedData, {structureId});
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
                                type: v.type,
                                code: v.code,
                                value: v.value
                            })),
                        })),
                        notifications: structure.notifications,
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