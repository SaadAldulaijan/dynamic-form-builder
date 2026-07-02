import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { FieldSchema, FormSchema } from '../models/form-schema';
import { allowedExtensionsValidator, dateGreaterThanFieldValidator, dateGreaterThanOrEqualFieldValidator, dateLessThanFieldValidator, dateLessThanOrEqualFieldValidator, exactLengthValidator, maxDateTodayValidator, maxDateValidator, maxFileSizeValidator, maxSelectedValidator, minDateTodayValidator, minDateValidator, minSelectedValidator, startsWithValidator } from './custom-validators';



@Injectable({
  providedIn: 'root',
})
export class DynamicFormBuilderService {


  buildForm(schema: FormSchema): FormGroup {
    const fields = this.getAllFields(schema);
    const group: Record<string, AbstractControl> = {};

    for (const field of fields) {
      group[field.key] = this.buildControl(field);
    }

    return new FormGroup(group);
  }

  buildGroup(fields: FieldSchema[]): FormGroup {
    const group: Record<string, AbstractControl> = {};

    for (const field of fields) {
      group[field.key] = this.buildControl(field);
    }

    return new FormGroup(group);
  }

  buildControl(field: FieldSchema): AbstractControl {
    switch (field.type) {
      case 'array':
        return new FormArray([]);

      case 'group':
        return this.buildGroup(field.fields);

      case 'multiselect':
        return new FormControl([], this.buildValidators(field));

      case 'checkbox':
        return new FormControl(false, this.buildValidators(field));

      default:
        return new FormControl(
          field.defaultValue ?? null,
          this.buildValidators(field)
        );
    }
  }



  private hasRequiredValidation(field: FieldSchema): boolean {
    return (
      field.type !== 'array' &&
      field.type !== 'group' &&
      field.validations?.required === true
    );
  }


  buildValidators(field: FieldSchema, forceRequired = false): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.hasRequiredValidation(field) || forceRequired) {
      validators.push(Validators.required);
    }

    switch (field.type) {
      case 'text':
      case 'textarea':
        if (field.validations?.minLength !== undefined) {
          validators.push(Validators.minLength(field.validations.minLength));
        }

        if (field.validations?.maxLength !== undefined) {
          validators.push(Validators.maxLength(field.validations.maxLength));
        }

        if (field.validations?.pattern) {
          validators.push(Validators.pattern(field.validations.pattern));
        }

        if (field.validations?.email) {
          validators.push(Validators.email);
        }

        if (field.validations?.startsWith) {
          validators.push(startsWithValidator(field.validations.startsWith));
        }

        if (field.validations?.exactLength) {
          validators.push(exactLengthValidator(field.validations.exactLength));
        }

        break;

      case 'number':
        if (field.validations?.min !== undefined) {
          validators.push(Validators.min(field.validations.min));
        }

        if (field.validations?.max !== undefined) {
          validators.push(Validators.max(field.validations.max));
        }

        break;

      case 'file':
        if (field.validations?.maxFileSizeMb !== undefined) {
          validators.push(maxFileSizeValidator(field.validations.maxFileSizeMb));
        }

        if (field.validations?.allowedExtensions?.length) {
          validators.push(
            allowedExtensionsValidator(field.validations.allowedExtensions)
          );
        }

        break;

      case 'date':
        if (field.validations?.minDate) {
          validators.push(minDateValidator(field.validations.minDate));
        }

        if (field.validations?.maxDate) {
          validators.push(maxDateValidator(field.validations.maxDate));
        }

        if (field.validations?.minDateToday) {
          validators.push(minDateTodayValidator());
        }

        if (field.validations?.maxDateToday) {
          validators.push(maxDateTodayValidator());
        }

        if (field.validations?.dateGreaterThanField) {
          validators.push(
            dateGreaterThanFieldValidator(
              field.validations.dateGreaterThanField
            )
          );
        }

        if (field.validations?.dateGreaterThanOrEqualField) {
          validators.push(
            dateGreaterThanOrEqualFieldValidator(
              field.validations.dateGreaterThanOrEqualField
            )
          );
        }

        if (field.validations?.dateLessThanField) {
          validators.push(
            dateLessThanFieldValidator(field.validations.dateLessThanField)
          );
        }

        if (field.validations?.dateLessThanOrEqualField) {
          validators.push(
            dateLessThanOrEqualFieldValidator(
              field.validations.dateLessThanOrEqualField
            )
          );
        }

        break;

      case 'multiselect':
        if (field.validations?.minSelected !== undefined) {
          validators.push(minSelectedValidator(field.validations.minSelected));
        }

        if (field.validations?.maxSelected !== undefined) {
          validators.push(maxSelectedValidator(field.validations.maxSelected));
        }

        break;

      case 'dropdown':
      case 'radio':
      case 'checkbox':
      case 'array':
      case 'group':
        break;
    }

    return validators;
  }


  // buildValidators(field: FieldSchema, forceRequired = false): ValidatorFn[] {
  //   const validators: ValidatorFn[] = [];

  //   if (field.validations?.required || forceRequired) validators.push(Validators.required);
  //   if (field.validations?.min !== undefined) validators.push(Validators.min(field.validations.min));
  //   if (field.validations?.max !== undefined) validators.push(Validators.max(field.validations.max));
  //   if (field.validations?.minLength !== undefined) validators.push(Validators.minLength(field.validations.minLength));
  //   if (field.validations?.maxLength !== undefined) validators.push(Validators.maxLength(field.validations.maxLength));
  //   if (field.validations?.pattern) validators.push(Validators.pattern(field.validations.pattern));
  //   if (field.validations?.email) validators.push(Validators.email);
  //   if (field.validations?.startsWith) validators.push(startsWithValidator(field.validations.startsWith));
  //   if (field.validations?.exactLength) validators.push(exactLengthValidator(field.validations.exactLength));


  //   if (field.validations?.maxFileSizeMb !== undefined) {
  //     validators.push(maxFileSizeValidator(field.validations.maxFileSizeMb));
  //   }

  //   if (field.validations?.allowedExtensions?.length) {
  //     validators.push(
  //       allowedExtensionsValidator(field.validations.allowedExtensions)
  //     );
  //   }


  //   if (field.validations?.minDate) {
  //     validators.push(minDateValidator(field.validations.minDate));
  //   }

  //   if (field.validations?.maxDate) {
  //     validators.push(maxDateValidator(field.validations.maxDate));
  //   }

  //   if (field.validations?.minDateToday) {
  //     validators.push(minDateTodayValidator());
  //   }

  //   if (field.validations?.maxDateToday) {
  //     validators.push(maxDateTodayValidator());
  //   }


  //   if (field.validations?.dateGreaterThanField) {
  //     validators.push(
  //       dateGreaterThanFieldValidator(field.validations.dateGreaterThanField)
  //     );
  //   }

  //   if (field.validations?.dateGreaterThanOrEqualField) {
  //     validators.push(
  //       dateGreaterThanOrEqualFieldValidator(field.validations.dateGreaterThanOrEqualField)
  //     );
  //   }

  //   if (field.validations?.dateLessThanField) {
  //     validators.push(
  //       dateLessThanFieldValidator(field.validations.dateLessThanField)
  //     );
  //   }

  //   if (field.validations?.dateLessThanOrEqualField) {
  //     validators.push(
  //       dateLessThanOrEqualFieldValidator(field.validations.dateLessThanOrEqualField)
  //     );
  //   }

  //   if (field.validations?.minSelected !== undefined) {
  //     validators.push(minSelectedValidator(field.validations.minSelected));
  //   }

  //   if (field.validations?.maxSelected !== undefined) {
  //     validators.push(maxSelectedValidator(field.validations.maxSelected));
  //   }


  //   return validators;
  // }

  getAllFields(schema: FormSchema): FieldSchema[] {
    if (schema.sections?.length) {
      return schema.sections.flatMap(section => section.fields);
    }

    return schema.fields ?? [];
  }




}
