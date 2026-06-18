import { FieldSchema } from "../form-schema";
import { BaseFieldSchema } from "./base-field.schema";

export interface GroupFieldSchema extends BaseFieldSchema {
  type: 'group';
  fields: FieldSchema[];
}