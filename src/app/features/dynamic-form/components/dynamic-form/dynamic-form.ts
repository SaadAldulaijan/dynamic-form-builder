import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sampleFormSchema } from '../../schemas/sample-form';
import { FieldSchema } from '../../models/form-schema';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder';
import { FieldRenderer } from '../field-renderer/field-renderer';
import { DynamicFormRuleEngineService } from '../../services/dynamic-form-rule-engine';




@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FieldRenderer
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
})
export class DynamicForm implements OnInit {

  schema = sampleFormSchema;
  form!: FormGroup;
  activeSectionIndex = 0;


  constructor(private formBuilderService: DynamicFormBuilderService, private ruleEngine: DynamicFormRuleEngineService) { }


  ngOnInit(): void {
    this.form = this.formBuilderService.buildForm(this.schema);

    this.ruleEngine.setupRules(this.getAllFields(), this.form);
  }

  get sections() {
    if (this.schema.sections?.length) {
      return this.schema.sections;
    }

    return [
      {
        key: 'default',
        title: this.schema.title,
        fields: this.schema.fields ?? []
      }
    ];
  }


  previousSection(): void {
    if (this.activeSectionIndex > 0) {
      this.activeSectionIndex--;
    }
  }




  isSectionValid(sectionIndex: number): boolean {
    const section = this.sections[sectionIndex];

    return section.fields.every(field => {
      const control = this.form.get(field.key);

      if (!control) {
        return true;
      }

      return control.valid || control.disabled;
    });
  }

  markSectionAsTouched(sectionIndex: number): void {
    const section = this.sections[sectionIndex];

    for (const field of section.fields) {
      const control = this.form.get(field.key);

      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  canGoToSection(targetIndex: number): boolean {
    if (targetIndex <= this.activeSectionIndex) {
      return true;
    }

    for (let i = 0; i < targetIndex; i++) {
      if (!this.isSectionValid(i)) {
        return false;
      }
    }

    return true;
  }

  goToSection(index: number): void {
    if (!this.canGoToSection(index)) {
      this.markSectionAsTouched(this.activeSectionIndex);
      return;
    }

    this.activeSectionIndex = index;
  }

  nextSection(): void {
    if (!this.isSectionValid(this.activeSectionIndex)) {
      this.markSectionAsTouched(this.activeSectionIndex);
      return;
    }

    if (this.activeSectionIndex < this.sections.length - 1) {
      this.activeSectionIndex++;
    }
  }

  getAllFields(): FieldSchema[] {
    return this.sections.flatMap(section => section.fields);
  }


  isVisible(field: FieldSchema): boolean {
    if (!field.visibleWhen) return true;

    return this.ruleEngine.evaluateCondition(field.visibleWhen, this.form);
  }


  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const rawValue = this.form.getRawValue();

    console.log(rawValue);
    console.log(rawValue.supportingAttachment);
  }



}
