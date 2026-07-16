import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { DateFieldSchema } from '../../../../models/fields/date-field.schema';
import { ValidationMessageCode } from '../../../../models/fields/base-field.schema';

@Component({
  selector: 'app-date-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-control.html',
  styleUrl: './date-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateControl {
  readonly field = input.required<DateFieldSchema>();
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

    const firstError = Object.keys(control.errors)[0] as ValidationMessageCode; 
    const currentField = this.field();
    const messageKey = currentField.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return currentField.messages?.[firstError] ?? `${this.fieldLabel()} is invalid`;
  });

  readonly minDate = computed(() => {
    const validations = this.field().validations;

    if (validations?.minDate) {
      return validations.minDate;
    }

    if (validations?.minDateToday) {
      return this.today();
    }

    return null;
  });

  readonly maxDate = computed(() => {
    const validations = this.field().validations;

    if (validations?.maxDate) {
      return validations.maxDate;
    }

    if (validations?.maxDateToday) {
      return this.today();
    }

    return null;
  });

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

}
