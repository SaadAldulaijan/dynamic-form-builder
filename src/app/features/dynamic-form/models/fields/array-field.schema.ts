import { FieldSchema } from "../form-schema";
import { FieldLayoutSchema } from "../layout/form-layout";
import { ArrayValidation } from "../validations/array-validation";
import { BaseFieldSchema } from "./base-field.schema";

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