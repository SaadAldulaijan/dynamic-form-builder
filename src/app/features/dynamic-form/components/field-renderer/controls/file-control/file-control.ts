import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { FileFieldSchema } from '../../../../models/fields/file-field.schema';

@Component({
  selector: 'app-file-control',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './file-control.html',
  styleUrl: './file-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileControl {
  readonly field = input.required<FileFieldSchema>();
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

  readonly isDisabled = computed(() => {
    this.controlState();

    return this.control()?.disabled === true;
  });

  readonly selectedFile = computed(() => {
    this.controlState();
    const value = this.control()?.value;

    if (value instanceof File) {
      return value;
    }

    return null;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const control = this.control();

    if (!control) {
      return;
    }

    control.setValue(file);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  removeFile(fileInput: HTMLInputElement): void {
    const control = this.control();

    if (!control) {
      return;
    }

    control.setValue(null);
    control.markAsTouched();
    control.updateValueAndValidity();

    fileInput.value = '';
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

}
