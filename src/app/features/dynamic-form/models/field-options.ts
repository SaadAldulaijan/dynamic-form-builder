import { FieldValue } from "./validations/field-value";

export interface FieldOption {
  label?: string;
  labelKey?: string;
  value: FieldValue;
  parentValue?: FieldValue;
}

