import { TextFieldSchema } from './fields/text-field.schema';
import { NumberFieldSchema } from './fields/number-field.schema';
import { DropdownFieldSchema } from './fields/dropdown-field.schema';
import { CheckboxFieldSchema } from './fields/checkbox-field.schema';
import { RadioFieldSchema } from './fields/radio-field.schema';
import { FileFieldSchema } from './fields/file-field.schema';
import { DateFieldSchema } from './fields/date-field.schema';
import { MultiselectFieldSchema } from './fields/multiselect-field.schema';
import { ArrayFieldSchema } from './fields/array-field.schema';
import { GroupFieldSchema } from './fields/group-field.schema';
import { FormLayoutSchema, SectionLayoutSchema } from './layout/form-layout';
import { TextareaFieldSchema } from './fields/textarea-field.schema';
import { JsonViewerFieldSchema } from './fields/json-viewer-field.schema';
import { GoogleMapFieldSchema } from './fields/google-map-field.schema';


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

