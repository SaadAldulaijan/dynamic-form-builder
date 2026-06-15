// import { Component, OnInit } from '@angular/core';
// import { FieldSchema, sampleFormSchema } from './form-schema';
// import { FormGroup } from '@angular/forms';
// import { FormBuilderService } from './form-builder';

import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sampleFormSchema } from './form-schema';
import { FieldSchema } from './form-schema';
import { FormBuilderService } from './form-builder';
import { FieldRenderer } from './field-renderer/field-renderer';




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

  constructor(private formBuilderService: FormBuilderService) { }


  ngOnInit(): void {
    this.form = this.formBuilderService.buildForm(this.schema);

    this.setupDependencies();
  }

  setupDependencies(): void {
    for (const field of this.schema.fields) {
      if (!field.dependsOn) continue;

      this.form.get(field.dependsOn)?.valueChanges.subscribe(() => {
        this.form.get(field.key)?.setValue(null);
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

    console.log(this.form.value);
  }



}
