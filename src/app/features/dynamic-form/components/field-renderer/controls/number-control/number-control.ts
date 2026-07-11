import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { NumberFieldSchema } from '../../../../models/fields/number-field.schema';

@Component({
  selector: 'app-number-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './number-control.html',
  styleUrl: './number-control.scss',
})
export class NumberControl {
  readonly field = input.required<NumberFieldSchema>();
  readonly form = input.required<FormGroup>();

  private translate = inject(TranslateService);

  private readonly langChange = toSignal(this.translate.onLangChange.pipe(startWith(null)), {
    initialValue: null,
  });

  readonly control = computed(() => {
    const currentForm = this.form();
    const currentField = this.field();

    return currentForm.get(currentField.key);
  });

  private readonly controlState = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) => {
        if (!control) {
          return of(null);
        }

        return merge(control.statusChanges, control.valueChanges, control.events).pipe(
          startWith(null),
        );
      }),
    ),
    { initialValue: null },
  );

  readonly fieldLabel = computed(() => {
    this.langChange();
    const currentField = this.field();

    return this.text(currentField.label, currentField.labelKey);
  });

  readonly placeholder = computed(() => {
    this.langChange();
    const placeholderKey = this.field().display?.placeholderKey;

    if (!placeholderKey) {
      return '';
    }

    return this.translate.instant(placeholderKey);
  });

  readonly prefix = computed(() => {
    this.langChange();
    const prefixKey = this.field().display?.prefixKey;

    if (!prefixKey) {
      return null;
    }

    return this.translate.instant(prefixKey);
  });

  readonly suffix = computed(() => {
    this.langChange();
    const suffixKey = this.field().display?.suffixKey;

    if (!suffixKey) {
      return null;
    }

    return this.translate.instant(suffixKey);
  });

  readonly isRequired = computed(() => {
    this.controlState();
    const control = this.control();

    if (!control) {
      return false;
    }

    return control.hasValidator(Validators.required);
  });

  readonly labelClass = computed(() => {
    return this.field().layout?.labelClass ?? 'form-label';
  });

  readonly controlClass = computed(() => {
    return this.field().layout?.controlClass ?? 'form-control';
  });

  readonly errorClass = computed(() => {
    return this.field().layout?.errorClass ?? 'text-danger small mt-1';
  });

  readonly showError = computed(() => {
    this.controlState();
    const control = this.control();

    return !!(control?.touched && control.invalid);
  });

  readonly errorMessage = computed(() => {
    this.langChange();
    this.controlState();
    const control = this.control();

    if (!control?.errors) {
      return null;
    }

    const firstError = Object.keys(control.errors)[0];
    const currentField = this.field();
    const messageKey = currentField.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return currentField.messages?.[firstError] ?? `${this.fieldLabel()} is invalid`;
  });

  onNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.control();

    if (!control) {
      return;
    }

    let rawValue = input.value.replace(/,/g, '');
    const allowDecimal = this.field().validations?.allowDecimal === true;

    rawValue = allowDecimal ? rawValue.replace(/[^\d.-]/g, '') : rawValue.replace(/[^\d-]/g, '');

    if (this.field().display?.useThousandsSeparator) {
      input.value = rawValue === '' ? '' : this.formatNumberWithCommas(rawValue);
    } else {
      input.value = rawValue;
    }

    if (rawValue === '') {
      control.setValue(null);
    } else {
      const numericValue = Number(rawValue);

      control.setValue(Number.isNaN(numericValue) ? rawValue : numericValue);
    }

    control.markAsTouched();
    control.updateValueAndValidity();
  }

  formatNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.control();

    if (!control) {
      return;
    }

    const value = control.value;

    if (value === null || value === undefined || value === '') {
      input.value = '';
      return;
    }

    if (this.field().display?.useThousandsSeparator) {
      input.value = this.formatNumberWithCommas(value);
    }
  }

  formatNumberWithCommas(value: unknown): string {
    const valueAsString = String(value);
    const [integerPart, decimalPart] = valueAsString.split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  displayValue(): string {
    return this.getNumberDisplayValue();
  }

  private getNumberDisplayValue(): string {
    const fieldKey = this.field().key;
    const value = this.form().getRawValue()?.[fieldKey] ?? this.control()?.value;

    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (!this.field().display?.useThousandsSeparator) {
      return String(value);
    }

    return this.formatNumberWithCommas(value);
  }
}
