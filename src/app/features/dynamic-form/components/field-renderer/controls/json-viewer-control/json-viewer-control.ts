import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { JsonViewerFieldSchema } from '../../../../models/fields/json-viewer-field.schema';

@Component({
  selector: 'app-json-viewer-control',
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './json-viewer-control.html',
  styleUrl: './json-viewer-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonViewerControl {
  readonly field = input.required<JsonViewerFieldSchema>();
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

  readonly labelClass = computed(() => {
    return this.field().layout?.labelClass ?? 'form-label';
  });

  readonly viewerValue = computed(() => {
    this.controlState();

    return this.control()?.value ?? null;
  });

  readonly hasValue = computed(() => {
    return this.viewerValue() !== null && this.viewerValue() !== undefined;
  });

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

}
