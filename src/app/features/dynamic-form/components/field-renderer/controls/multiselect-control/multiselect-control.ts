import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { FieldOption } from '../../../../models/field-options';
import { MultiselectFieldSchema } from '../../../../models/fields/multiselect-field.schema';
import { ValidationMessageCode } from '../../../../models/fields/base-field.schema';

@Component({
  selector: 'app-multiselect-control',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './multiselect-control.html',
  styleUrl: './multiselect-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiselectControl {
  readonly field = input.required<MultiselectFieldSchema>();
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

  readonly isRequired = computed(() => {
    this.controlState();
    const control = this.control();

    if (!control) {
      return false;
    }

    return control.hasValidator(Validators.required);
  });

  readonly labelClass = computed(() => {
    return this.field().layout?.labelClass ?? 'form-label d-block';
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

    const firstError = Object.keys(control.errors)[0] as ValidationMessageCode;
    const currentField = this.field();
    const messageKey = currentField.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return currentField.messages?.[firstError] ?? `${this.fieldLabel()} is invalid`;
  });

  readonly options = computed(() => {
    this.langChange();
    this.controlState();

    return this.field().options ?? [];
  });

  readonly selectedCount = computed(() => {
    this.controlState();

    return this.getMultiselectValue().length;
  });

  readonly maxSelected = computed(() => {
    this.controlState();

    return this.field().validations?.maxSelected;
  });

  optionLabel(option: FieldOption): string {
    return this.text(option.label, option.labelKey);
  }

  isMultiSelected(value: any): boolean {
    return this.getMultiselectValue().includes(value);
  }

  toggleMultiSelect(value: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.control();

    if (!control || control.disabled) {
      return;
    }

    const currentValue = this.getMultiselectValue();

    let nextValue: any[];

    if (input.checked) {
      nextValue = [...currentValue, value];
    } else {
      nextValue = currentValue.filter(x => x !== value);
    }

    control.setValue(nextValue);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  isMultiselectOptionDisabled(value: any): boolean {
    const control = this.control();

    if (!control || control.disabled) {
      return true;
    }

    if (this.isMultiSelected(value)) {
      return false;
    }

    const maxSelected = this.maxSelected();

    if (maxSelected === undefined) {
      return false;
    }

    return this.getMultiselectValue().length >= maxSelected;
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  private getMultiselectValue(): any[] {
    const value = this.control()?.value;

    return Array.isArray(value) ? value : [];
  }

}
