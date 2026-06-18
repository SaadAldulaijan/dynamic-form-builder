import { BaseFieldSchema } from './base-field.schema';
import { FieldOption } from '../field-options';
import { RequiredValidation } from '../validations/required-validation';

export interface DropdownFieldSchema extends BaseFieldSchema {
  type: 'dropdown';
  options: FieldOption[];
  dependsOn?: string;
  validations?: RequiredValidation;
}