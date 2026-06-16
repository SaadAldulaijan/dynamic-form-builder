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

  getAllFields(schema: FormSchema): FieldSchema[] {
    if (schema.sections?.length) {
      return schema.sections.flatMap(section => section.fields);
    }

    return schema.fields ?? [];
  }

  buildControl(field: FieldSchema): AbstractControl {
    if (field.type === 'array') {
      return new FormArray([]);
    }

    if (field.type === 'multiselect') {
      return new FormControl([], this.buildValidators(field));
    }

    return new FormControl(null, this.buildValidators(field));
  }


  buildGroup(fields: FieldSchema[]): FormGroup {
    const group: Record<string, AbstractControl> = {};

    for (const field of fields) {
      group[field.key] = this.buildControl(field);
    }

    return new FormGroup(group);
  }

  buildValidators(field: FieldSchema, forceRequired = false): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.validations?.required || forceRequired) validators.push(Validators.required);
    if (field.validations?.min !== undefined) validators.push(Validators.min(field.validations.min));
    if (field.validations?.max !== undefined) validators.push(Validators.max(field.validations.max));
    if (field.validations?.minLength !== undefined) validators.push(Validators.minLength(field.validations.minLength));
    if (field.validations?.maxLength !== undefined) validators.push(Validators.maxLength(field.validations.maxLength));
    if (field.validations?.pattern) validators.push(Validators.pattern(field.validations.pattern));
    if (field.validations?.email) validators.push(Validators.email);
    if (field.validations?.startsWith) validators.push(startsWithValidator(field.validations.startsWith));
    if (field.validations?.exactLength) validators.push(exactLengthValidator(field.validations.exactLength));


    if (field.validations?.maxFileSizeMb !== undefined) {
      validators.push(maxFileSizeValidator(field.validations.maxFileSizeMb));
    }

    if (field.validations?.allowedExtensions?.length) {
      validators.push(
        allowedExtensionsValidator(field.validations.allowedExtensions)
      );
    }


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
        dateGreaterThanFieldValidator(field.validations.dateGreaterThanField)
      );
    }

    if (field.validations?.dateGreaterThanOrEqualField) {
      validators.push(
        dateGreaterThanOrEqualFieldValidator(field.validations.dateGreaterThanOrEqualField)
      );
    }

    if (field.validations?.dateLessThanField) {
      validators.push(
        dateLessThanFieldValidator(field.validations.dateLessThanField)
      );
    }

    if (field.validations?.dateLessThanOrEqualField) {
      validators.push(
        dateLessThanOrEqualFieldValidator(field.validations.dateLessThanOrEqualField)
      );
    }

    if (field.validations?.minSelected !== undefined) {
      validators.push(minSelectedValidator(field.validations.minSelected));
    }

    if (field.validations?.maxSelected !== undefined) {
      validators.push(maxSelectedValidator(field.validations.maxSelected));
    }


    return validators;
  }




  // buildForm(schema: FormSchema): FormGroup {
  //   const fields = this.getAllFields(schema);

  //   const group: Record<string, AbstractControl> = {};

  //   for (const field of fields) {
  //     group[field.key] = this.buildControl(field);
  //   }
  //   const form = new FormGroup(group);

  //   this.setupConditionalRequired(fields, form);
  //   this.setupConditionalDisabled(fields, form);
  //   this.setupClearHiddenValues(fields, form);



  //   return form;

  // }


  // buildGroup(fields: FieldSchema[]): FormGroup {
  //   const group: Record<string, AbstractControl> = {};

  //   for (const field of fields) {
  //     group[field.key] = this.buildControl(field);
  //   }

  //   const formGroup = new FormGroup(group);

  //   this.setupConditionalRequired(fields, formGroup);
  //   this.setupConditionalDisabled(fields, formGroup);
  //   this.setupClearHiddenValues(fields, formGroup);


  //   return formGroup;
  // }

  // setupConditionalRequired(fields: FieldSchema[], form: FormGroup): void {
  //   for (const field of fields) {
  //     if (!field.requiredWhen) {
  //       continue;
  //     }

  //     const targetControl = form.get(field.key);
  //     const sourceControl = form.get(field.requiredWhen.field);

  //     if (!targetControl || !sourceControl) {
  //       continue;
  //     }

  //     const applyRequiredState = () => {
  //       const shouldBeRequired = this.evaluateCondition(
  //         field.requiredWhen!,
  //         form
  //       );

  //       targetControl.setValidators(
  //         this.buildValidators(field, shouldBeRequired)
  //       );

  //       targetControl.updateValueAndValidity({
  //         emitEvent: false
  //       });
  //     };

  //     applyRequiredState();

  //     sourceControl.valueChanges.subscribe(() => {
  //       applyRequiredState();
  //     });
  //   }
  // }

  // evaluateCondition(condition: FieldCondition, form: FormGroup): boolean {
  //   const actualValue = form.get(condition.field)?.value;

  //   switch (condition.operator) {
  //     case 'equals':
  //       return actualValue === condition.value;

  //     case 'notEquals':
  //       return actualValue !== condition.value;

  //     default:
  //       return false;
  //   }
  // }


  // setupConditionalDisabled(fields: FieldSchema[], form: FormGroup): void {
  //   for (const field of fields) {
  //     if (!field.disabledWhen) {
  //       continue;
  //     }

  //     const targetControl = form.get(field.key);
  //     const sourceControl = form.get(field.disabledWhen.field);

  //     if (!targetControl || !sourceControl) {
  //       continue;
  //     }

  //     const applyDisabledState = () => {
  //       const shouldBeDisabled = this.evaluateCondition(
  //         field.disabledWhen!,
  //         form
  //       );

  //       if (shouldBeDisabled) {
  //         targetControl.disable({
  //           emitEvent: false
  //         });
  //       } else {
  //         targetControl.enable({
  //           emitEvent: false
  //         });
  //       }

  //       targetControl.updateValueAndValidity({
  //         emitEvent: false
  //       });
  //     };

  //     applyDisabledState();

  //     sourceControl.valueChanges.subscribe(() => {
  //       applyDisabledState();
  //     });
  //   }
  // }


  // setupClearHiddenValues(fields: FieldSchema[], form: FormGroup): void {
  //   for (const field of fields) {
  //     if (!field.visibleWhen || !field.clearValueWhenHidden) {
  //       continue;
  //     }

  //     const targetControl = form.get(field.key);
  //     const sourceControl = form.get(field.visibleWhen.field);

  //     if (!targetControl || !sourceControl) {
  //       continue;
  //     }

  //     const clearIfHidden = () => {
  //       const isVisible = this.evaluateCondition(field.visibleWhen!, form);

  //       if (!isVisible) {
  //         targetControl.reset(null, {
  //           emitEvent: false
  //         });

  //         targetControl.markAsUntouched();
  //         targetControl.markAsPristine();
  //       }
  //     };

  //     clearIfHidden();

  //     sourceControl.valueChanges.subscribe(() => {
  //       clearIfHidden();
  //     });
  //   }
  // }


}
