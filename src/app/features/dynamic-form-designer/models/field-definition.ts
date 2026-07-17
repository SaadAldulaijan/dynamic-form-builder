import { FieldType } from "../../dynamic-form/models/field-types";
import { FieldSchema } from "../../dynamic-form/models/form-schema";
import { FieldCategory } from "./field-category";

export interface FieldDefinition {
  type: FieldType;
  label: string;
  description: string;
  category: FieldCategory;
  iconClass?: string;
  createDefault: () => FieldSchema;
}