import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldSchema } from '../form-schema';
import { FormBuilderService } from '../form-builder';

@Component({
  selector: 'app-field-renderer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './field-renderer.html',
  styleUrl: './field-renderer.scss',
})
export class FieldRenderer {

  @Input({ required: true }) field!: FieldSchema;
  @Input({ required: true }) form!: FormGroup | any;

  constructor(private formBuilderService: FormBuilderService) { }

  get arrayControl(): FormArray {
    return this.form.get(this.field.key) as FormArray;
  }

  addArrayItem(): void {
    if (!this.field.itemSchema) return;

    const group = this.formBuilderService.buildGroup(this.field.itemSchema.fields);
    this.arrayControl.push(group);
  }

  removeArrayItem(index: number): void {
    this.arrayControl.removeAt(index);
  }

  isVisibleInsideGroup(field: FieldSchema, group: FormGroup | any): boolean {
    if (!field.visibleWhen) return true;

    const actualValue = group.get(field.visibleWhen.field)?.value;

    if (field.visibleWhen.operator === 'equals') {
      return actualValue === field.visibleWhen.value;
    }

    if (field.visibleWhen.operator === 'notEquals') {
      return actualValue !== field.visibleWhen.value;
    }

    return true;
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

}
