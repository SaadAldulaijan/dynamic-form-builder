import { DateValidation } from "../validations/date-validation";
import { RequiredValidation } from "../validations/required-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface DateFieldSchema extends BaseFieldSchema {
  type: 'date';
  validations?: RequiredValidation & DateValidation;
}