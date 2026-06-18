import { BaseFieldSchema } from './base-field.schema';
import { FieldOption } from '../field-options';
import { RequiredValidation } from '../validations/required-validation';

export interface RadioFieldSchema extends BaseFieldSchema {
  type: 'radio';
  options: FieldOption[];
  validations?: RequiredValidation;
}