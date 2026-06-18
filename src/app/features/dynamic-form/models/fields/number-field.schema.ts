import { BaseFieldSchema } from './base-field.schema';
import { RequiredValidation } from '../validations/required-validation';
import { NumberValidation } from '../validations/number-validation';

export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number';
  validations?: RequiredValidation & NumberValidation;
}