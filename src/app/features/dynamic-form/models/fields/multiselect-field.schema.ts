import { BaseFieldSchema } from './base-field.schema';
import { FieldOption } from '../field-options';
import { RequiredValidation } from '../validations/required-validation';
import { SelectionValidation } from '../validations/selection-validation';

export interface MultiselectFieldSchema extends BaseFieldSchema {
  type: 'multiselect';
  options: FieldOption[];
  validations?: RequiredValidation & SelectionValidation;
}