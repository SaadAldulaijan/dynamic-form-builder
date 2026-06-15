import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startsWithValidator(prefix: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    return control.value.startsWith(prefix)
      ? null
      : { startsWith: true };
  };
}

export function exactLengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    return control.value.length === length
      ? null
      : { exactLength: true };
  };
}