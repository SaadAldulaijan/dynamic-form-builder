import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { FieldSchema } from '../../../../models/form-schema';
import { ArrayFieldSchema } from '../../../../models/fields/array-field.schema';
import { DynamicFormBuilderService } from '../../../../services/dynamic-form-builder';
import { DynamicFormRuleEngineService } from '../../../../services/dynamic-form-rule-engine';
import { FieldRenderer } from '../../field-renderer';

@Component({
  selector: 'app-array-control',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, forwardRef(() => FieldRenderer)],
  templateUrl: './array-control.html',
  styleUrl: './array-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayControl {
  readonly field = input.required<ArrayFieldSchema>();
  readonly form = input.required<FormGroup>();
  readonly allFields = input<FieldSchema[]>([]);

  private modalService = inject(NgbModal);
  private dynamicFormBuilderService = inject(DynamicFormBuilderService);
  private ruleEngine = inject(DynamicFormRuleEngineService);
  private translate = inject(TranslateService);

  currentArrayItemForm?: FormGroup;
  editingArrayIndex: number | null = null;

  get arrayControl(): FormArray {
    return this.form().get(this.field().key) as FormArray;
  }

  openArrayItemModal(content: any, index?: number): void {
    const fields = this.field().itemSchema.fields;

    this.currentArrayItemForm = this.dynamicFormBuilderService.buildGroup(fields);
    this.ruleEngine.setupRules(fields, this.currentArrayItemForm);

    if (index !== undefined) {
      this.editingArrayIndex = index;

      const existingValue = this.arrayControl.at(index).getRawValue();

      this.currentArrayItemForm.patchValue(existingValue, {
        emitEvent: false,
      });
    } else {
      this.editingArrayIndex = null;
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }

  saveArrayItem(modal: any): void {
    if (!this.currentArrayItemForm) {
      return;
    }

    this.currentArrayItemForm.markAllAsTouched();

    if (this.currentArrayItemForm.invalid) {
      return;
    }

    if (this.editingArrayIndex !== null) {
      const existingGroup = this.arrayControl.at(this.editingArrayIndex) as FormGroup;

      existingGroup.patchValue(this.currentArrayItemForm.getRawValue(), {
        emitEvent: false,
      });
    } else {
      this.arrayControl.push(this.currentArrayItemForm);
    }

    this.arrayControl.markAsTouched();
    this.arrayControl.updateValueAndValidity();

    modal.close();
    this.currentArrayItemForm = undefined;
    this.editingArrayIndex = null;
  }

  getArrayItemTitle(index: number): string {
    const value = this.arrayControl.at(index)?.value;
    const titleField = this.field().itemTitleField;

    if (!titleField) {
      return `Item ${index + 1}`;
    }

    return value?.[titleField] || `Item ${index + 1}`;
  }

  addArrayItem(): void {
    const fields = this.field().itemSchema.fields;
    const group = this.dynamicFormBuilderService.buildGroup(fields);

    this.ruleEngine.setupRules(fields, group);

    this.arrayControl.push(group);
  }

  removeArrayItem(index: number): void {
    this.arrayControl.removeAt(index);
  }

  getFieldWrapperClass(): string {
    return this.field().layout?.wrapperClass ?? 'col-12';
  }

  getFieldLabel(): string {
    const currentField = this.field();

    return this.text(currentField.label, currentField.labelKey);
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  isVisibleInsideGroup(field: FieldSchema, group: FormGroup | any): boolean {
    if (!field.visibleWhen) {
      return true;
    }

    return this.ruleEngine.evaluateCondition(field.visibleWhen, group);
  }

}
