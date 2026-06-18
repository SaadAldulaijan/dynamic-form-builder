import { RequiredValidation } from "../validations/required-validation";
import { TextValidation } from "../validations/text-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface TextFieldSchema extends BaseFieldSchema {
  type: 'text';
  validations?: RequiredValidation & TextValidation;
}