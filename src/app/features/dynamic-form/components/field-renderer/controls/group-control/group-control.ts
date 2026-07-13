import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { FieldSchema } from '../../../../models/form-schema';
import { GroupFieldSchema } from '../../../../models/fields/group-field.schema';
import { DynamicFormRuleEngineService } from '../../../../services/dynamic-form-rule-engine';
import { FieldRenderer } from '../../field-renderer';

@Component({
  selector: 'app-group-control',
  imports: [CommonModule, ReactiveFormsModule, forwardRef(() => FieldRenderer)],
  templateUrl: './group-control.html',
  styleUrl: './group-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupControl {
  readonly field = input.required<GroupFieldSchema>();
  readonly form = input.required<FormGroup>();
  readonly allFields = input<FieldSchema[]>([]);

  private translate = inject(TranslateService);
  private ruleEngine = inject(DynamicFormRuleEngineService);

  private readonly langChange = toSignal(this.translate.onLangChange.pipe(startWith(null)), {
    initialValue: null,
  });

  readonly nestedGroup = computed(() => {
    const currentForm = this.form();
    const currentField = this.field();

    return currentForm.get(currentField.key) as FormGroup;
  });

  private readonly nestedGroupState = toSignal(
    toObservable(this.nestedGroup).pipe(
      switchMap(group => {
        if (!group) {
          return of(null);
        }

        return merge(group.statusChanges, group.valueChanges, group.events).pipe(startWith(null));
      })
    ),
    { initialValue: null }
  );

  readonly fieldLabel = computed(() => {
    this.langChange();
    const currentField = this.field();

    return this.text(currentField.label, currentField.labelKey);
  });

  readonly containerClass = computed(() => {
    return this.field().layout?.containerClass ?? 'border rounded p-3 mb-3';
  });

  readonly titleClass = computed(() => {
    return this.field().layout?.titleClass ?? 'float-none w-auto px-2 h6';
  });

  readonly fieldsWrapperClass = computed(() => {
    return this.field().layout?.fieldsWrapperClass ?? 'row g-3';
  });

  isVisibleInsideNestedGroup(field: FieldSchema): boolean {
    this.nestedGroupState();
    const group = this.nestedGroup();

    if (!field.visibleWhen) {
      return true;
    }

    return this.ruleEngine.evaluateCondition(field.visibleWhen, group);
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

}
