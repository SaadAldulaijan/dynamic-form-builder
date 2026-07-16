import { FieldConditionExpression } from "../field-conditions";
// import { FieldType } from "../field-types";
import { FieldLayoutSchema } from "../layout/form-layout";
import { BaseFieldDisplaySchema } from '../display/field-display';
import { FieldActionSchema } from "../actions/field-action";

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