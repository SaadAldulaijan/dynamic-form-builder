import { BaseFieldSchema } from './base-field.schema';
import { RequiredValidation } from '../validations/required-validation';
import { TextValidation } from '../validations/text-validation';

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: 'textarea';
  rows?: number;
  validations?: RequiredValidation & TextValidation;
}