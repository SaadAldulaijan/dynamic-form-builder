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


export function maxFileSizeValidator(maxSizeMb: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File | null;

    if (!file) {
      return null;
    }

    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    return file.size <= maxSizeBytes
      ? null
      : { maxFileSize: true };
  };
}

export function allowedExtensionsValidator(extensions: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File | null;

    if (!file) {
      return null;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    const normalizedExtensions = extensions.map(x =>
      x.replace('.', '').toLowerCase()
    );

    return fileExtension && normalizedExtensions.includes(fileExtension)
      ? null
      : { allowedExtensions: true };
  };
}