import { FieldSchema } from "../form-schema";
import { ArrayValidation } from "../validations/array-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface ArrayFieldSchema extends BaseFieldSchema {
  type: 'array';
  arrayDisplayMode?: 'inline' | 'modal-list';
  itemTitleField?: string;
  itemSchema: {
    fields: FieldSchema[];
  };
  validations?: ArrayValidation;
}