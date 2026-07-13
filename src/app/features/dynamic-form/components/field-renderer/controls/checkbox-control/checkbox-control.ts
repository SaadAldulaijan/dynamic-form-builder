import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { CheckboxFieldSchema } from '../../../../models/fields/checkbox-field.schema';

@Component({
  selector: 'app-checkbox-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox-control.html',
  styleUrl: './checkbox-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxControl {
  readonly field = input.required<CheckboxFieldSchema>();
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
    return this.field().layout?.labelClass ?? 'form-check-label';
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

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

}
