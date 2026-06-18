import { FileValidation } from "../validations/file-validation";
import { RequiredValidation } from "../validations/required-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface FileFieldSchema extends BaseFieldSchema {
  type: 'file';
  validations?: RequiredValidation & FileValidation;
}