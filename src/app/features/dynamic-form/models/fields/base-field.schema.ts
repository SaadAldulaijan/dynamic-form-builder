import { FieldCondition } from "../field-conditions";
import { FieldType } from "../field-types";

export interface BaseFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  
  defaultValue?: unknown;
  readonly?: boolean;

  messages?: Record<string, string>;

  visibleWhen?: FieldCondition;
  requiredWhen?: FieldCondition;
  disabledWhen?: FieldCondition;
  
  clearValueWhenHidden?: boolean;

  calculatedFrom?: CalculatedFieldSchema;

}


export interface CalculatedFieldSchema {
  fields: string[];
  expression: string;
  precision?: number;
}

