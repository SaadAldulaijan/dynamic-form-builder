import { FieldSchema } from "../form-schema";
import { ArrayValidation } from "../validations/array-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: 'array';
  itemSchema: {
    fields: FieldSchema[];
  };
  validations?: ArrayValidation;
}