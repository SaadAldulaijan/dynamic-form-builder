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


function toDateOnly(value: any): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function todayDateOnly(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = toDateOnly(control.value);
    const min = toDateOnly(minDate);

    if (!value || !min) {
      return null;
    }

    return value >= min ? null : { minDate: true };
  };
}

export function maxDateValidator(maxDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = toDateOnly(control.value);
    const max = toDateOnly(maxDate);

    if (!value || !max) {
      return null;
    }

    return value <= max ? null : { maxDate: true };
  };
}

export function minDateTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = toDateOnly(control.value);

    if (!value) {
      return null;
    }

    return value >= todayDateOnly() ? null : { minDateToday: true };
  };
}

export function maxDateTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = toDateOnly(control.value);

    if (!value) {
      return null;
    }

    return value <= todayDateOnly() ? null : { maxDateToday: true };
  };
}


export function dateGreaterThanFieldValidator(fieldKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;

    if (!parent) {
      return null;
    }

    const current = toDateOnly(control.value);
    const other = toDateOnly(parent.get(fieldKey)?.value);

    if (!current || !other) {
      return null;
    }

    return current > other ? null : { dateGreaterThanField: true };
  };
}

export function dateGreaterThanOrEqualFieldValidator(fieldKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;

    if (!parent) {
      return null;
    }

    const current = toDateOnly(control.value);
    const other = toDateOnly(parent.get(fieldKey)?.value);

    if (!current || !other) {
      return null;
    }

    return current >= other ? null : { dateGreaterThanOrEqualField: true };
  };
}

export function dateLessThanFieldValidator(fieldKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;

    if (!parent) {
      return null;
    }

    const current = toDateOnly(control.value);
    const other = toDateOnly(parent.get(fieldKey)?.value);

    if (!current || !other) {
      return null;
    }

    return current < other ? null : { dateLessThanField: true };
  };
}

export function dateLessThanOrEqualFieldValidator(fieldKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;

    if (!parent) {
      return null;
    }

    const current = toDateOnly(control.value);
    const other = toDateOnly(parent.get(fieldKey)?.value);

    if (!current || !other) {
      return null;
    }

    return current <= other ? null : { dateLessThanOrEqualField: true };
  };
}


export function minSelectedValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value as any[] | null;
    const count = Array.isArray(value) ? value.length : 0;

    return count >= min
      ? null
      : { minSelected: true };


    // const value = control.value as any[] | null;

    // if (!value || value.length === 0) {
    //   return null;
    // }

    // return value.length >= min
    //   ? null
    //   : { minSelected: true };
  };
}

export function maxSelectedValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as any[] | null;

    if (!value || value.length === 0) {
      return null;
    }

    return value.length <= max
      ? null
      : { maxSelected: true };
  };
}