import { Injectable } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { FieldSchema, FormSchema } from './form-schema';
import { exactLengthValidator, startsWithValidator } from './custom-validators';



@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  buildForm(schema: FormSchema): FormGroup {
    const group: Record<string, any> = {};

    for (const field of schema.fields) {
      group[field.key] = this.buildControl(field);
    }

    return new FormGroup(group);
  }

  buildControl(field: FieldSchema): any {
    if (field.type === 'array') {
      return new FormArray([]);
    }

    return new FormControl(null, this.buildValidators(field));
  }

  buildGroup(fields: FieldSchema[]): FormGroup {
    const group: Record<string, any> = {};

    for (const field of fields) {
      group[field.key] = this.buildControl(field);
    }

    return new FormGroup(group);
  }

  buildValidators(field: FieldSchema) {
    const validators = [];

    if (field.validations?.required) validators.push(Validators.required);
    if (field.validations?.min !== undefined) validators.push(Validators.min(field.validations.min));
    if (field.validations?.max !== undefined) validators.push(Validators.max(field.validations.max));
    if (field.validations?.minLength !== undefined) validators.push(Validators.minLength(field.validations.minLength));
    if (field.validations?.maxLength !== undefined) validators.push(Validators.maxLength(field.validations.maxLength));

    if (field.validations?.pattern) {
      validators.push(Validators.pattern(field.validations.pattern));
    }


    if (field.validations?.email) {
      validators.push(Validators.email);
    }



    if (field.validations?.startsWith) {
      validators.push(
        startsWithValidator(field.validations.startsWith)
      );
    }

    if (field.validations?.exactLength) {
      validators.push(
        exactLengthValidator(field.validations.exactLength)
      );
    }
    return validators;
  }


}
