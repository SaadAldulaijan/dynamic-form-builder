import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sampleFormSchema } from '../../schemas/sample-form';
import { FieldSchema } from '../../models/form-schema';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder';
import { FieldRenderer } from '../field-renderer/field-renderer';




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


  constructor(private formBuilderService: DynamicFormBuilderService) { }


  ngOnInit(): void {
    this.form = this.formBuilderService.buildForm(this.schema);

    this.setupDependencies();
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






  // setupDependencies(): void {
  //   for (const field of this.schema.fields) {
  //     if (!field.dependsOn) continue;

  //     this.form.get(field.dependsOn)?.valueChanges.subscribe(() => {
  //       this.form.get(field.key)?.setValue(null);
  //     });
  //   }
  // }


  getAllFields(): FieldSchema[] {
    return this.sections.flatMap(section => section.fields);
  }

  // setupDependencies(): void {
  //   for (const field of this.getAllFields()) {
  //     if (!field.dependsOn) continue;

  //     this.form.get(field.dependsOn)?.valueChanges.subscribe(() => {
  //       this.form.get(field.key)?.setValue(null);
  //     });
  //   }
  // }

  setupDependencies(): void {
    for (const field of this.getAllFields()) {
      if (!field.dependsOn) {
        continue;
      }

      const parentControl = this.form.get(field.dependsOn);
      const childControl = this.form.get(field.key);

      if (!parentControl || !childControl) {
        continue;
      }

      let previousValue = parentControl.value;

      parentControl.valueChanges.subscribe(currentValue => {
        if (currentValue === previousValue) {
          return;
        }

        previousValue = currentValue;

        childControl.setValue(null, {
          emitEvent: false
        });

        childControl.markAsUntouched();
        childControl.markAsPristine();
      });
    }
  }


  isVisible(field: FieldSchema): boolean {
    if (!field.visibleWhen) return true;

    const actualValue = this.form.get(field.visibleWhen.field)?.value;

    if (field.visibleWhen.operator === 'equals') {
      return actualValue === field.visibleWhen.value;
    }

    if (field.visibleWhen.operator === 'notEquals') {
      return actualValue !== field.visibleWhen.value;
    }

    return true;
  }


  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;
    console.log(this.form.getRawValue());
  }



}
