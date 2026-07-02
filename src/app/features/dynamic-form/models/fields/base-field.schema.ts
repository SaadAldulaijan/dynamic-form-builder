import { FieldCondition } from "../field-conditions";
import { FieldType } from "../field-types";
import { FieldLayoutSchema } from "../layout/form-layout";

export interface BaseFieldSchema {
  key: string;
  label?: string;
  labelKey?: string;
  type: FieldType;
  
  defaultValue?: unknown;
  readonly?: boolean;

  messages?: Record<string, string>;
  messageKeys?: Record<string, string>;

  visibleWhen?: FieldCondition;
  requiredWhen?: FieldCondition;
  disabledWhen?: FieldCondition;
  
  clearValueWhenHidden?: boolean;

  calculatedFrom?: CalculatedFieldSchema;

  layout?: FieldLayoutSchema;

}


export interface CalculatedFieldSchema {
  fields: string[];
  expression: string;
  precision?: number;
}

