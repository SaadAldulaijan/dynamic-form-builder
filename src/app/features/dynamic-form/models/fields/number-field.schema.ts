import { BaseFieldSchema } from './base-field.schema';
import { RequiredValidation } from '../validations/required-validation';
import { NumberValidation } from '../validations/number-validation';
import { NumberFieldDisplaySchema } from '../display/field-display';

export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number';
  display?: NumberFieldDisplaySchema;
  calculatedFrom?: CalculatedFieldSchema;
  validations?: RequiredValidation & NumberValidation;
}


export interface CalculatedFieldSchema {
  fields: string[];
  expression: string;
  precision?: number;
}

