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


export interface FormSchema {
  title: string;
  fields?: FieldSchema[];
  sections?: FormSectionSchema[];
}

export interface FormSectionSchema {
  key: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
}


export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | DropdownFieldSchema
  | CheckboxFieldSchema
  | RadioFieldSchema
  | FileFieldSchema
  | DateFieldSchema
  | MultiselectFieldSchema
  | ArrayFieldSchema
  | GroupFieldSchema;


// export interface FieldSchema {
//   key: string;
//   label: string;
//   type: FieldType;
//   defaultValue?: string;
//   options?: FieldOption[];
//   dependsOn?: string;
//   readonly?: boolean;
//   fields?: FieldSchema[];
//   calculatedFrom?: {
//     fields: string[];
//     expression: string;
//     precision?: number;
//   };
//   validations?: {
//     required?: boolean;
//     min?: number;
//     max?: number;
//     minLength?: number;
//     maxLength?: number;
//     pattern?: string;
//     startsWith?: string;
//     exactLength?: number;
//     email?: boolean;
//     maxFileSizeMb?: number;
//     allowedExtensions?: string[];

//     minDate?: string;
//     maxDate?: string;

//     minDateToday?: boolean;
//     maxDateToday?: boolean;

//     dateGreaterThanField?: string;
//     dateGreaterThanOrEqualField?: string;

//     dateLessThanField?: string;
//     dateLessThanOrEqualField?: string;

//     minSelected?: number;
//     maxSelected?: number;
//   };
//   messages?: {
//     [key: string]: string;
//   };
//   visibleWhen?: FieldCondition;
//   requiredWhen?: FieldCondition;
//   disabledWhen?: FieldCondition;
//   clearValueWhenHidden?: boolean;
//   itemSchema?: {
//     fields: FieldSchema[];
//   };
// }