import { CommonModule } from '@angular/common';
import { Component, inject, Inject, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldSchema } from '../../models/form-schema';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder';
import { DynamicFormRuleEngineService } from '../../services/dynamic-form-rule-engine';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-field-renderer',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './field-renderer.html',
  styleUrl: './field-renderer.scss',
})
export class FieldRenderer {
  @Input({ required: true }) field!: FieldSchema;
  @Input({ required: true }) form!: FormGroup | any;

  private modalService = inject(NgbModal);
  private dynamicFormBuilderService = inject(DynamicFormBuilderService);
  private ruleEngine = inject(DynamicFormRuleEngineService);
  private translate = inject(TranslateService);

  currentArrayItemForm?: FormGroup;
  editingArrayIndex: number | null = null;
  openArrayItemModal(content: any, index?: number): void {
    if (this.field.type !== 'array') {
      return;
    }

    const fields = this.field.itemSchema.fields;

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
    if (this.field.type !== 'array') {
      return;
    }

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
    if (this.field.type !== 'array') {
      return `Item ${index + 1}`;
    }

    const value = this.arrayControl.at(index)?.value;

    if (!this.field.itemTitleField) {
      return `Item ${index + 1}`;
    }

    return value?.[this.field.itemTitleField] || `Item ${index + 1}`;
  }

  get arrayControl(): FormArray {
    return this.form.get(this.field.key) as FormArray;
  }

  getFieldWrapperClass(): string {
    return this.field.layout?.wrapperClass ?? 'col-12';
  }

  getLabelClass(extendedClass?: string): string {
    return this.field.layout?.labelClass ?? extendedClass ?? 'form-label';
  }

  getControlClass(defaultClass: string): string {
    return this.field.layout?.controlClass ?? defaultClass;
  }

  getErrorClass(): string {
    return this.field.layout?.errorClass ?? 'text-danger small mt-1';
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  getFieldLabel(): string {
    return this.text(this.field.label, this.field.labelKey);
  }

  getOptionLabel(option: any): string {
    return this.text(option.label, option.labelKey);
  }

  addArrayItem(): void {
    if (this.field.type !== 'array') return;

    if (!this.field.itemSchema) return;

    const fields = this.field.itemSchema.fields;
    const group = this.dynamicFormBuilderService.buildGroup(fields);

    this.ruleEngine.setupRules(fields, group);

    this.arrayControl.push(group);
  }

  removeArrayItem(index: number): void {
    this.arrayControl.removeAt(index);
  }

  isVisibleInsideGroup(field: FieldSchema, group: FormGroup | any): boolean {
    if (!field.visibleWhen) return true;

    return this.ruleEngine.evaluateCondition(field.visibleWhen, group);
  }

  getNestedGroup(): FormGroup {
    return this.form.get(this.field.key) as FormGroup;
  }

  isVisibleInsideNestedGroup(field: FieldSchema): boolean {
    const group = this.getNestedGroup();

    if (!field.visibleWhen) {
      return true;
    }

    return this.ruleEngine.evaluateCondition(field.visibleWhen, group);
  }

  getRadioName(): string {
    return `${this.field.key}_${this.form}`;
  }

  setRadioValue(value: any): void {
    const control = this.form.get(this.field.key);

    if (!control || control.disabled) {
      return;
    }

    control.setValue(value);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  onRadioChange(value: any): void {
    this.form.get(this.field.key)?.setValue(value);
  }

  getErrorMessage(): string | null {
    const control = this.form.get(this.field.key);

    if (!control?.errors) {
      return null;
    }

    const firstError = Object.keys(control.errors)[0];

    const messageKey = this.field.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return this.field.messages?.[firstError] ?? `${this.getFieldLabel()} is invalid`;
  }

  getOptions() {
    if (this.field.type !== 'dropdown') {
      return [];
    }

    if (!this.field.dependsOn) {
      return this.field.options ?? [];
    }

    const parentValue = this.form.get(this.field.dependsOn)?.value;

    if (!parentValue) {
      return [];
    }

    return (this.field.options ?? []).filter((x) => x.parentValue === parentValue);
  }

  getDateMin(): string | null {
    if (this.field.type !== 'date') {
      return null;
    }

    if (this.field.validations?.minDate) {
      return this.field.validations.minDate;
    }

    if (this.field.validations?.minDateToday) {
      return new Date().toISOString().split('T')[0];
    }

    return null;
  }

  getDateMax(): string | null {
    if (this.field.type !== 'date') {
      return null;
    }

    if (this.field.validations?.maxDate) {
      return this.field.validations.maxDate;
    }

    if (this.field.validations?.maxDateToday) {
      return new Date().toISOString().split('T')[0];
    }

    return null;
  }

  getMultiselectValue(): any[] {
    const value = this.form.get(this.field.key)?.value;

    return Array.isArray(value) ? value : [];
  }

  isMultiSelected(value: any): boolean {
    return this.getMultiselectValue().includes(value);
  }

  toggleMultiSelect(value: any, event: Event): void {
    if (this.field.type !== 'multiselect') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const control = this.form.get(this.field.key);

    if (!control || control.disabled) {
      return;
    }

    const currentValue = this.getMultiselectValue();

    let nextValue: any[];

    if (input.checked) {
      nextValue = [...currentValue, value];
    } else {
      nextValue = currentValue.filter((x) => x !== value);
    }

    control.setValue(nextValue);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  isMultiselectOptionDisabled(value: any): boolean {
    if (this.field.type !== 'multiselect') {
      return true;
    }

    const control = this.form.get(this.field.key);

    if (!control || control.disabled) {
      return true;
    }

    if (this.isMultiSelected(value)) {
      return false;
    }

    const maxSelected = this.field.validations?.maxSelected;

    if (maxSelected === undefined) {
      return false;
    }

    return this.getMultiselectValue().length >= maxSelected;
  }

  onFileSelected(event: Event): void {
    if (this.field.type !== 'file') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    const control = this.form.get(this.field.key);

    if (!control) {
      return;
    }

    control.setValue(file);
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  removeFile(fileInput: HTMLInputElement): void {
    if (this.field.type !== 'file') {
      return;
    }

    const control = this.form.get(this.field.key);

    if (!control) {
      return;
    }

    control.setValue(null);
    control.markAsTouched();
    control.updateValueAndValidity();

    fileInput.value = '';
  }

  getNumberDisplayValue(): string {
    if (this.field.type !== 'number') {
      return '';
    }

    const value = this.form.get(this.field.key)?.value;

    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (!this.field.display?.useThousandsSeparator) {
      return String(value);
    }

    return this.formatNumberWithCommas(value);
  }

  onNumberInput(event: Event): void {
    if (this.field.type !== 'number') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const control = this.form.get(this.field.key);

    if (!control) {
      return;
    }

    let rawValue = input.value.replace(/,/g, '');

    const allowDecimal = this.field.validations?.allowDecimal === true;

    rawValue = allowDecimal ? rawValue.replace(/[^\d.-]/g, '') : rawValue.replace(/[^\d-]/g, '');

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
    if (this.field.type !== 'number') {
      return;
    }

    const input = event.target as HTMLInputElement;
    const control = this.form.get(this.field.key);

    if (!control) {
      return;
    }

    const value = control.value;

    if (value === null || value === undefined || value === '') {
      input.value = '';
      return;
    }

    if (this.field.display?.useThousandsSeparator) {
      input.value = this.formatNumberWithCommas(value);
    }
  }

  formatNumberWithCommas(value: any): string {
    const valueAsString = String(value);
    const [integerPart, decimalPart] = valueAsString.split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }
}
