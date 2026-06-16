import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldSchema } from '../../models/form-schema';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder';
import { DynamicFormRuleEngineService } from '../../services/dynamic-form-rule-engine';

@Component({
  selector: 'app-field-renderer',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './field-renderer.html',
  styleUrl: './field-renderer.scss',
})
export class FieldRenderer {

  @Input({ required: true }) field!: FieldSchema;
  @Input({ required: true }) form!: FormGroup | any;

  constructor(private dynamicFormBuilderService: DynamicFormBuilderService, private ruleEngine: DynamicFormRuleEngineService) { }

  get arrayControl(): FormArray {
    return this.form.get(this.field.key) as FormArray;
  }

  addArrayItem(): void {
    if (!this.field.itemSchema) return;

    const fields = this.field.itemSchema.fields;
    const group = this.dynamicFormBuilderService.buildGroup(fields);

    this.ruleEngine.setupRules(fields, group);

    this.arrayControl.push(group);

    // const group = this.dynamicFormBuilderService.buildGroup(this.field.itemSchema.fields);
    // this.arrayControl.push(group);
  }

  removeArrayItem(index: number): void {
    this.arrayControl.removeAt(index);
  }

  isVisibleInsideGroup(field: FieldSchema, group: FormGroup | any): boolean {
    if (!field.visibleWhen) return true;

    return this.ruleEngine.evaluateCondition(field.visibleWhen, group);
  }


  onRadioChange(value: any): void {
    this.form.get(this.field.key)?.setValue(value);
  }


  getErrorMessage(): string | null {

    const control = this.form.get(this.field.key);

    if (!control?.errors) {
      return null;
    }

    const errors = Object.keys(control.errors);

    if (errors.length === 0) {
      return null;
    }

    const firstError = errors[0];

    return (
      this.field.messages?.[firstError] ??
      `${this.field.label} is invalid`
    );
  }

  getOptions() {
    if (!this.field.dependsOn) {
      return this.field.options ?? [];
    }

    const parentValue = this.form.get(this.field.dependsOn)?.value;

    if (!parentValue) {
      return [];
    }

    return (this.field.options ?? []).filter(x => x.parentValue === parentValue);
  }

  onFileSelected(event: Event): void {
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
    const control = this.form.get(this.field.key);

    if (!control) {
      return;
    }

    control.setValue(null);
    control.markAsTouched();
    control.updateValueAndValidity();

    fileInput.value = '';
  }

}
