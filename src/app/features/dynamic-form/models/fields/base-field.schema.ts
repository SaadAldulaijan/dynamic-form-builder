import { FieldConditionExpression } from "../field-conditions";
// import { FieldType } from "../field-types";
import { FieldLayoutSchema } from "../layout/form-layout";
import { BaseFieldDisplaySchema } from '../display/field-display';
import { FieldActionSchema } from "../actions/field-action";

export interface BaseFieldSchema {
  key: string;
  label?: string;
  labelKey?: string;
  // type: FieldType;
  
  defaultValue?: unknown;
  // readonly?: boolean;
  state?: {
    readonly?: boolean;
    disabled?: boolean;
  },
  display?: BaseFieldDisplaySchema;

  messages?: Record<string, string>;
  messageKeys?: Record<string, string>;

  visibleWhen?: FieldConditionExpression;
  requiredWhen?: FieldConditionExpression;
  disabledWhen?: FieldConditionExpression;
  
  clearValueWhenHidden?: boolean;

  calculatedFrom?: CalculatedFieldSchema;

  layout?: FieldLayoutSchema;
  actions?: FieldActionSchema[];

}


export interface CalculatedFieldSchema {
  fields: string[];
  expression: string;
  precision?: number;
}

