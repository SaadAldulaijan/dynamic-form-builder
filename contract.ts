
export interface FormSchema {
    key: string;
    title?: string;
    titleKey?: string;
    layout?: FormLayoutSchema;
    fields?: FieldSchema[];
    sections?: FormSectionSchema[];
}

export interface FormSectionSchema {
    key: string;
    title?: string;
    titleKey?: string;
    description?: string;
    descriptionKey?: string;
    layout?: SectionLayoutSchema;
    fields: FieldSchema[];
}


export type FieldSchema =
    | TextFieldSchema
    | TextareaFieldSchema
    | NumberFieldSchema
    | DropdownFieldSchema
    | CheckboxFieldSchema
    | RadioFieldSchema
    | FileFieldSchema
    | DateFieldSchema
    | MultiselectFieldSchema
    | ArrayFieldSchema
    | GroupFieldSchema
    | JsonViewerFieldSchema;




export interface NumberFieldSchema extends BaseFieldSchema {
    type: 'number';
    validations?: RequiredValidation & NumberValidation;
}

export interface NumberValidation {
    min?: number;
    max?: number;
    allowDecimal?: boolean;
    decimalPrecision?: number;
}

export interface FileValidation {
    maxFileSizeMb?: number;
    allowedExtensions?: string[];
}

export interface DateFieldSchema extends BaseFieldSchema {
    type: 'date';
    validations?: RequiredValidation & DateValidation;
}

export interface GroupFieldSchema extends BaseFieldSchema {
    type: 'group';
    fields: FieldSchema[];
}

export interface JsonViewerFieldSchema extends BaseFieldSchema {
    type: 'jsonViewer';
}

export interface DateValidation {
    minDate?: string;
    maxDate?: string;
    minDateToday?: boolean;
    maxDateToday?: boolean;
    dateGreaterThanField?: string;
    dateGreaterThanOrEqualField?: string;
    dateLessThanField?: string;
    dateLessThanOrEqualField?: string;
}

export interface MultiselectFieldSchema extends BaseFieldSchema {
    type: 'multiselect';
    options: FieldOption[];
    validations?: RequiredValidation & SelectionValidation;
}
export interface SelectionValidation {
    minSelected?: number;
    maxSelected?: number;
}

export interface ArrayFieldSchema extends BaseFieldSchema {
    type: 'array';
    arrayDisplayMode?: 'inline' | 'modal-list' | 'readonly-list';
    itemTitleField?: string;
    itemSchema: {
        fields: FieldSchema[];
    };
    validations?: ArrayValidation;
}
export interface ArrayValidation {
    minItems?: number;
    maxItems?: number;
}

export interface FileFieldSchema extends BaseFieldSchema {
    type: 'file';
    validations?: RequiredValidation & FileValidation;
}
export interface DropdownFieldSchema extends BaseFieldSchema {
    type: 'dropdown';
    options: FieldOption[];
    dependsOn?: string;
    validations?: RequiredValidation;
}
export interface FieldOption {
    label?: string;
    labelKey?: string;
    value: any;
    parentValue?: any;
}
export interface RequiredValidation {
    required?: boolean;
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
    type: 'checkbox';
    validations?: RequiredValidation;
}export interface RadioFieldSchema extends BaseFieldSchema {
    type: 'radio';
    options: FieldOption[];
    validations?: RequiredValidation;
}
export interface TextareaFieldSchema extends BaseFieldSchema {
    type: 'textarea';
    rows?: number;
    validations?: RequiredValidation & TextValidation;
}
export interface TextValidation {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    startsWith?: string;
    exactLength?: number;
    email?: boolean;
}



export interface TextFieldSchema extends BaseFieldSchema {
    type: 'text';
    validations?: RequiredValidation & TextValidation;
}
export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'dropdown'
    | 'checkbox'
    | 'radio'
    | 'array'
    | 'file'
    | 'date'
    | 'multiselect'
    | 'group'
    | 'jsonViewer';

export interface FieldDisplaySchema {
    useThousandsSeparator?: boolean;
    prefixKey?: string;
    suffixKey?: string;
    placeholderKey?: string;
}

export interface BaseFieldSchema {
    key: string;
    label?: string;
    labelKey?: string;
    type: FieldType;

    defaultValue?: unknown;
    readonly?: boolean;
    display?: FieldDisplaySchema;

    messages?: Record<string, string>;
    messageKeys?: Record<string, string>;

    visibleWhen?: FieldCondition;
    requiredWhen?: FieldCondition;
    disabledWhen?: FieldCondition;

    clearValueWhenHidden?: boolean;

    calculatedFrom?: CalculatedFieldSchema;

    layout?: FieldLayoutSchema;
    actions?: FieldActionSchema[];

}
export type FieldConditionOperator =
    | 'equals'
    | 'notEquals'
    | 'in'
    | 'notIn';

export interface FieldCondition {
    field: string;
    operator: FieldConditionOperator;
    value: any;
}

export type FieldActionType = 'apiLookup';
export interface FieldActionSchema {
    key: string;
    type: FieldActionType;

    label?: string;
    labelKey?: string;

    endpointKey: string;

    requestMapping: Record<string, string>;

    targetField?: string;
    responseHandling?: ApiLookupResponseHandling;
}


export interface ApiLookupResponseHandling {
    jsonViewerField?: string;
    mapping?: Record<string, string>;
    arrayMapping?: Record<string, ApiLookupArrayMapping>;
    disableMappedFields?: boolean;
}

export interface ApiLookupArrayMapping {
    sourcePath: string;
    targetField: string;
}

export interface CalculatedFieldSchema {
    fields: string[];
    expression: string;
    precision?: number;
}

export interface FormLayoutSchema {
    containerClass?: string;
}

export interface SectionLayoutSchema {
    containerClass?: string;
    titleClass?: string;
    descriptionClass?: string;
    fieldsWrapperClass?: string;
}

export interface FieldLayoutSchema {
    wrapperClass?: string;
    labelClass?: string;
    controlClass?: string;
    errorClass?: string;

    containerClass?: string;
    titleClass?: string;
    fieldsWrapperClass?: string;
    itemClass?: string;
    actionsClass?: string;
}