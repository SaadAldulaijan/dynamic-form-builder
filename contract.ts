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

export interface BaseFieldDisplaySchema {
    placeholder?: string;
    placeholderKey?: string;
}

export interface NumberFieldDisplaySchema extends BaseFieldDisplaySchema {
    useThousandsSeparator?: boolean;
    prefix?: string;
    prefixKey?: string;
    suffix?: string;
    suffixKey?: string;
}


export interface ArrayFieldSchema extends BaseFieldSchema {
    type: 'array';
    arrayDisplayMode?: ArrayDisplayMode;
    itemTitleField?: string;
    itemSchema: ArrayItemSchema;
    validations?: ArrayValidation;
    addLabel?: string;
    addLabelKey?: string;
    editLabel?: string;
    editLabelKey?: string;
    deleteLabel?: string;
    deleteLabelKey?: string;
}

export interface ArrayItemSchema {
    fields: FieldSchema[];
    layout?: FieldLayoutSchema;
}

export type ArrayDisplayMode = 'inline' | 'modal-list' | 'readonly-list';


export interface BaseFieldSchema {
    key: string;
    label?: string;
    labelKey?: string;
    defaultValue?: unknown;
    state?: {
        readonly?: boolean;
        disabled?: boolean;
    },
    display?: BaseFieldDisplaySchema;
    messages?: ValidationMessages;
    messageKeys?: ValidationMessages;
    visibleWhen?: FieldConditionExpression;
    requiredWhen?: FieldConditionExpression;
    disabledWhen?: FieldConditionExpression;
    clearValueWhenHidden?: boolean;
    accessibility?: FieldAccessibilitySchema;
    layout?: FieldLayoutSchema;
    actions?: FieldActionSchema[];

}


export type ValidationMessageCode =
    | 'required'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'email'
    | 'exactLength'
    | 'minSelected'
    | 'maxSelected'
    | 'minItems'
    | 'maxItems'
    | 'minDate'
    | 'maxDate'
    | 'dateComparison'
    | 'fileSize'
    | 'fileExtension';

export type ValidationMessages = Partial<Record<ValidationMessageCode, string>>;

export interface FieldAccessibilitySchema {
    ariaLabel?: string;
    ariaLabelKey?: string;
    ariaDescription?: string;
    ariaDescriptionKey?: string;
}


export interface CheckboxFieldSchema extends BaseFieldSchema {
    type: 'checkbox';
    validations?: RequiredValidation;
}


export interface DateFieldSchema extends BaseFieldSchema {
    type: 'date';
    validations?: RequiredValidation & DateValidation;
}

export interface DropdownFieldSchema extends BaseFieldSchema {
    type: 'dropdown';
    options: FieldOption[];
    dependency?: DropdownDependencySchema;
    validations?: RequiredValidation;
}


export interface DropdownDependencySchema {
    field: string;
    clearOnChange?: boolean;
}

export interface FileFieldSchema extends BaseFieldSchema {
    type: 'file';
    validations?: RequiredValidation & FileValidation;
}

export interface GoogleMapFieldSchema extends BaseFieldSchema {
    type: 'googleMap';
    defaultValue?: GoogleMapLocation;
    defaultCenter?: GoogleMapLocation;
    defaultZoom?: number;
    mapHeight?: string;
    markerDraggable?: boolean;
    allowMapClick?: boolean;
    validations?: RequiredValidation;
}

export interface GoogleMapLocation {
    latitude: number;
    longitude: number;
}


export interface GroupFieldSchema extends BaseFieldSchema {
    type: 'group';
    fields: FieldSchema[];
}

export interface JsonViewerFieldSchema extends BaseFieldSchema {
    type: 'jsonViewer';
}

export interface MultiselectFieldSchema extends BaseFieldSchema {
    type: 'multiselect';
    options: FieldOption[];
    validations?: RequiredValidation & SelectionValidation;
}

export interface NumberFieldSchema extends BaseFieldSchema {
    type: 'number';
    display?: NumberFieldDisplaySchema;
    calculatedFrom?: CalculatedFieldSchema;
    validations?: RequiredValidation & NumberValidation;
}


export interface CalculatedFieldSchema {
    fields: string[];
    expression: string;
    precision?: number;
}

export interface RadioFieldSchema extends BaseFieldSchema {
    type: 'radio';
    options: FieldOption[];
    validations?: RequiredValidation;
}

export interface TextFieldSchema extends BaseFieldSchema {
    type: 'text';
    validations?: RequiredValidation & TextValidation;
}

export interface TextareaFieldSchema extends BaseFieldSchema {
    type: 'textarea';
    rows?: number;
    validations?: RequiredValidation & TextValidation;
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

export interface ArrayValidation {
    minItems?: number;
    maxItems?: number;
}

export type IsoDateString =
    `${number}-${number}-${number}`;


export interface DateValidation {
    minDate?: IsoDateString;
    maxDate?: IsoDateString;
    minDateToday?: boolean;
    maxDateToday?: boolean;
    comparisons?: DateFieldComparison[];
}


export type DateComparisonOperator =
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual';


export interface DateFieldComparison {
    field: string;
    operator: DateComparisonOperator;
}


export type FieldValue =
    | string
    | number
    | boolean
    | null
    | FieldValue[]
    | { [key: string]: FieldValue };

export interface FileValidation {
    maxFileSizeMb?: number;
    allowedExtensions?: string[];
    allowedMimeTypes?: string[];
}

export interface NumberValidation {
    min?: number;
    max?: number;
    allowDecimal?: boolean;
    decimalPrecision?: number;
}

export interface RequiredValidation {
    required?: boolean;
}

export interface SelectionValidation {
    minSelected?: number;
    maxSelected?: number;
}

export interface TextValidation {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    startsWith?: string;
    exactLength?: number;
    email?: boolean;
}


export type FieldCondition =
    | {
        field: string;
        operator: 'equals' | 'notEquals';
        value: FieldValue;
    }
    | {
        field: string;
        operator: 'in' | 'notIn';
        value: FieldValue[];
    };

export type FieldConditionExpression =
    | FieldCondition
    | FieldConditionGroup;

export interface FieldConditionGroup {
    logic: 'and' | 'or';
    conditions: FieldConditionExpression[];
}



export interface FieldOption {
    label?: string;
    labelKey?: string;
    value: FieldValue;
    parentValue?: FieldValue;
}

export type FieldType = FieldSchema['type'];



interface BaseFormSchema {
    key: string;
    version: number;
    title?: string;
    titleKey?: string;
    layout?: FormLayoutSchema;
}

export interface FlatFormSchema extends BaseFormSchema {
    fields: FieldSchema[];
    sections?: never;
}

export interface SectionedFormSchema extends BaseFormSchema {
    sections: FormSectionSchema[];
    fields?: never;
}

export type FormSchema =
    | FlatFormSchema
    | SectionedFormSchema;


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
    | JsonViewerFieldSchema
    | GoogleMapFieldSchema;
