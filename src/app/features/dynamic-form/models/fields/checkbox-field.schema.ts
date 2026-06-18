import { BaseFieldSchema } from './base-field.schema';
import { RequiredValidation } from '../validations/required-validation';

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: 'checkbox';
  validations?: RequiredValidation;
}