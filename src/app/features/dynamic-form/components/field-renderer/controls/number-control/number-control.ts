import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberControl {

  readonly field = input.required<NumberFieldSchema>();
  readonly form = input.required<FormGroup>();

  private translate = inject(TranslateService);

  private readonly langChange = toSignal(
    this.translate.onLangChange.pipe(startWith(null)),
    { initialValue: null }
  );

  readonly control = computed(() => {
    return this.form().get(this.field().key);
  });

  private readonly controlState = toSignal(
    toObservable(this.control).pipe(
      switchMap(control => {
        if (!control) {
          return of(null);
        }

        return merge(control.statusChanges, control.valueChanges, control.events).pipe(startWith(null));
      })
    ),
    { initialValue: null }
  );

  readonly fieldLabel = computed(() => {
    this.langChange();
    const currentField = this.field();

    return this.text(currentField.label, currentField.labelKey);
  });

  readonly placeholder = computed(() => {
    this.langChange();
    const placeholderKey = this.field().display?.placeholderKey;

    return placeholderKey ? this.translate.instant(placeholderKey) : '';
  });

  readonly prefix = computed(() => {
    this.langChange();
    const prefixKey = this.field().display?.prefixKey;

    return prefixKey ? this.translate.instant(prefixKey) : null;
  });

  readonly suffix = computed(() => {
    this.langChange();
    const suffixKey = this.field().display?.suffixKey;

    return suffixKey ? this.translate.instant(suffixKey) : null;
  });

  readonly isRequired = computed(() => {
    this.controlState();
    const control = this.control();

    return !!control?.hasValidator(Validators.required);
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

  readonly displayValue = computed(() => {
    this.controlState();

    const value = this.control()?.value;

    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (!this.field().display?.useThousandsSeparator) {
      return String(value);
    }

    return this.formatNumberWithCommas(value);
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
    const inputElement = event.target as HTMLInputElement;
    const control = this.control();

    if (!control) {
      return;
    }

    let rawValue = inputElement.value.replace(/,/g, '');
    const allowDecimal = this.field().validations?.allowDecimal === true;

    rawValue = allowDecimal
      ? rawValue.replace(/[^\d.-]/g, '')
      : rawValue.replace(/[^\d-]/g, '');

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
    const inputElement = event.target as HTMLInputElement;
    const control = this.control();

    if (!control) {
      return;
    }

    const value = control.value;

    if (value === null || value === undefined || value === '') {
      inputElement.value = '';
      return;
    }

    if (this.field().display?.useThousandsSeparator) {
      inputElement.value = this.formatNumberWithCommas(value);
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
}
