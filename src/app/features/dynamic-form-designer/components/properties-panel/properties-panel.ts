import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDesignerStateService } from '../../services/form-designer-state.service';
import { FieldGeneralProperties } from '../../models/field-general-properties';
import { FieldValidationProperties } from '../../models/field-validation-properties';


@Component({
  selector: 'app-properties-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './properties-panel.html',
  styleUrls: ['./properties-panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPanel {
  private readonly designerState = inject(FormDesignerStateService);

  protected readonly schema = this.designerState.schema;

  protected readonly selectedNode = this.designerState.selectedNode;

  protected readonly selectedSection = this.designerState.selectedSection;

  protected readonly selectedField = this.designerState.selectedField;

  protected readonly activeFieldTab = signal<'general' | 'validation' | 'display'>('general');

  protected readonly formKeyControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)],
  });

  protected readonly formTitleControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly sectionKeyControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)],
  });

  protected readonly sectionTitleControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly sectionDescriptionControl = new FormControl('', {
    nonNullable: true,
  });

  // protected readonly fieldKeyControl = new FormControl('', {
  //   nonNullable: true,
  //   validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)],
  // });

  // protected readonly fieldLabelControl = new FormControl('', {
  //   nonNullable: true,
  //   validators: [Validators.required],
  // });

  protected readonly fieldGeneralForm =
    new FormGroup({
      key: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/,),]
      }),

      label: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      placeholder: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      // required: new FormControl(false, { nonNullable: true }),
      readonly: new FormControl(false, { nonNullable: true }),
      disabled: new FormControl(false, { nonNullable: true }),
    });

  protected get fieldKeyControl() {
    return this.fieldGeneralForm.controls.key;
  }

  protected get fieldLabelControl() {
    return this.fieldGeneralForm.controls.label;
  }

  protected selectFieldTab(tab: 'general' | 'validation' | 'display'): void {
    this.activeFieldTab.set(tab);
  }


  protected readonly fieldValidationForm = new FormGroup({
    required: new FormControl(false, { nonNullable: true }),

    minLength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    },
    ),

    maxLength: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    },
    ),

    pattern: new FormControl('', { nonNullable: true }),

    min: new FormControl<number | null>(null),

    max: new FormControl<number | null>(null),

    allowDecimal: new FormControl(false, { nonNullable: true }),

    decimalPrecision: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),

    maxFileSize: new FormControl<number | null>(null, {
      validators: [Validators.min(1)],
    }),

    allowedExtensions: new FormControl('', { nonNullable: true }),

    minSelections: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),

    maxSelections: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
    }),
  });

  constructor() {
    effect(() => {
      this.selectedNode();
      this.schema();

      this.loadSelectedValues();
    });
  }


  protected isTextField(): boolean {
    const type = this.selectedField()?.type;

    return (type === 'text' || type === 'textarea');
  }

  protected isNumberField(): boolean {
    return this.selectedField()?.type === 'number';
  }

  protected isFileField(): boolean {
    return this.selectedField()?.type === 'file';
  }

  protected isMultiSelectField(): boolean {
    return (
      this.selectedField()?.type ===
      'multiselect'
    );
  }

  protected hasOnlyRequiredValidation(): boolean {
    const type = this.selectedField()?.type;

    return (
      type === 'dropdown' ||
      type === 'radio' ||
      type === 'checkbox' ||
      type === 'date'
    );
  }



  protected loadSelectedValues(): void {
    const selectedNode = this.selectedNode();

    if (!selectedNode) {
      return;
    }

    if (selectedNode.type === 'form') {
      const schema = this.schema();
      this.formKeyControl.setValue(schema.key, { emitEvent: false });
      this.formTitleControl.setValue(schema.title ?? '', { emitEvent: false });
      return;
    }

    if (selectedNode.type === 'section') {
      const section = this.selectedSection();

      if (!section) {
        return;
      }

      this.sectionKeyControl.setValue(section.key, { emitEvent: false });

      this.sectionTitleControl.setValue(section.title ?? '', { emitEvent: false });

      this.sectionDescriptionControl.setValue(section.description ?? '', { emitEvent: false });

      return;
    }

    const field = this.selectedField();

    if (!field) {
      return;
    }

    this.fieldGeneralForm.reset(
      {
        key: field.key,
        label: field.label ?? '',
        placeholder: field.display?.placeholder ?? '',
        description: this.getFieldDescription(field),
        // required: this.getRequiredValue(field),
        readonly: field.state?.readonly ?? false,
        disabled: field.state?.disabled ?? false,
      },
      {
        emitEvent: false,
      },
    );


    const validations: Partial<FieldValidationProperties> = {};

    // const validations: Partial<FieldValidationProperties> = 'validations' in field ? { ...field.validations } : {};

    if ('validations' in field) {
      Object.assign(validations, field.validations);
    }

    this.fieldValidationForm.reset(
      {
        required: validations.required ?? false,
        minLength: validations.minLength ?? null,
        maxLength: validations.maxLength ?? null,
        pattern: validations.pattern ?? '',
        min: validations.min ?? null,
        max: validations.max ?? null,
        allowDecimal: validations.allowDecimal ?? false,
        decimalPrecision: validations.decimalPrecision ?? null,
        maxFileSize: field.type === 'file' ? field.validations?.maxFileSizeMb ?? null : null,
        allowedExtensions: validations.allowedExtensions?.join(', ') ?? '',
        minSelections: field.type === 'multiselect' ? field.validations?.minSelected ?? null : null,
        maxSelections: field.type === 'multiselect' ? field.validations?.maxSelected ?? null : null,
      },
      {
        emitEvent: false,
      },
    );




    // this.fieldKeyControl.setValue(field.key, {
    //   emitEvent: false,
    // });

    // this.fieldLabelControl.setValue(field.label ?? '', {
    //   emitEvent: false,
    // });
  }


  private validateTextRange(): boolean {
    const { minLength, maxLength } = this.fieldValidationForm.getRawValue();

    if (minLength !== null && maxLength !== null && minLength > maxLength) {
      this.fieldValidationForm.controls.maxLength.setErrors({ lessThanMinimum: true });
      return false;
    }

    return true;
  }


  private validateNumberRange(): boolean {
    const { min, max } = this.fieldValidationForm.getRawValue();

    if (min !== null && max !== null && min > max) {
      this.fieldValidationForm.controls.max.setErrors({ lessThanMinimum: true });
      return false;
    }

    return true;
  }

  private validateSelectionRange(): boolean {
    const { minSelections, maxSelections } = this.fieldValidationForm.getRawValue();

    if (minSelections !== null && maxSelections !== null && minSelections > maxSelections) {
      this.fieldValidationForm.controls.maxSelections.setErrors({ lessThanMinimum: true });
      return false;
    }

    return true;
  }


  protected updateFieldValidation(): void {
    const selectedField = this.selectedField();

    if (!selectedField) {
      return;
    }

    this.fieldValidationForm.markAllAsTouched();

    if (this.fieldValidationForm.invalid) {
      return;
    }

    if (this.isTextField() && !this.validateTextRange()) {
      return;
    }

    if (this.isNumberField() && !this.validateNumberRange()) {
      return;
    }

    if (this.isMultiSelectField() && !this.validateSelectionRange()) {
      return;
    }

    const value = this.fieldValidationForm.getRawValue();

    const properties: FieldValidationProperties = { required: value.required };

    if (this.isTextField()) {
      properties.minLength = value.minLength ?? undefined;

      properties.maxLength = value.maxLength ?? undefined;

      properties.pattern = value.pattern.trim() || undefined;
    }

    if (this.isNumberField()) {
      properties.min = value.min ?? undefined;

      properties.max = value.max ?? undefined;

      properties.allowDecimal = value.allowDecimal;

      properties.decimalPrecision = value.allowDecimal ? value.decimalPrecision ?? undefined : undefined;
    }

    if (this.isFileField()) {
      properties.maxFileSize = value.maxFileSize ?? undefined;

      properties.allowedExtensions = this.parseExtensions(value.allowedExtensions);
    }

    if (this.isMultiSelectField()) {
      properties.minSelections = value.minSelections ?? undefined;

      properties.maxSelections = value.maxSelections ?? undefined;
    }

    this.designerState.updateFieldValidationProperties(selectedField.key, properties);
  }

  private parseExtensions(value: string): string[] | undefined {
    const extensions = value.split(',').map(extension =>
      extension.trim().toLowerCase(),
    )
      .filter(Boolean)
      .map(extension =>
        extension.startsWith('.') ? extension : `.${extension}`,
      );

    return extensions.length > 0 ? [...new Set(extensions)] : undefined;
  }





  private getRequiredValue(field: object): boolean {
    if (!('validations' in field) || !field.validations ||
      typeof field.validations !== 'object' || !('required' in field.validations)) {
      return false;
    }

    return field.validations.required === true;
  }

  private getFieldDescription(field: object): string {
    if (!('description' in field) || typeof field.description !== 'string') {
      return '';
    }

    return field.description;
  }

  protected updateForm(): void {
    this.formKeyControl.markAsTouched();
    this.formTitleControl.markAsTouched();

    if (this.formKeyControl.invalid || this.formTitleControl.invalid) {
      return;
    }

    this.designerState.updateForm({
      key: this.formKeyControl.value.trim(),
      title: this.formTitleControl.value.trim(),
    });
  }

  protected updateSection(): void {
    const selectedSection = this.selectedSection();

    if (!selectedSection) {
      return;
    }

    this.sectionKeyControl.markAsTouched();
    this.sectionTitleControl.markAsTouched();

    if (this.sectionKeyControl.invalid || this.sectionTitleControl.invalid) {
      return;
    }

    const newKey = this.sectionKeyControl.value.trim();

    const isAvailable = this.designerState.isSectionKeyAvailable(newKey, selectedSection.key);

    if (!isAvailable) {
      this.sectionKeyControl.setErrors({ duplicate: true });
      return;
    }



    this.designerState.updateSection(selectedSection.key, {
      key: newKey,
      title: this.sectionTitleControl.value.trim(),
      description: this.sectionDescriptionControl.value.trim() || undefined,
    });
  }


  protected updateFieldGeneral(): void {
    const selectedField =
      this.selectedField();

    if (!selectedField) {
      return;
    }

    this.fieldGeneralForm.markAllAsTouched();

    if (this.fieldGeneralForm.invalid) {
      return;
    }

    const value = this.fieldGeneralForm.getRawValue();

    const newKey = value.key.trim();

    const isAvailable = this.designerState.isFieldKeyAvailable(newKey, selectedField.key);

    if (!isAvailable) {
      this.fieldKeyControl.setErrors({ duplicate: true });
      return;
    }

    const properties: FieldGeneralProperties = {
      key: newKey,
      label: value.label.trim(),
      placeholder: value.placeholder.trim() || undefined,
      description: value.description.trim() || undefined,
      // required: value.required,
      readonly: value.readonly,
      disabled: value.disabled,
    };

    this.designerState.updateFieldGeneralProperties(selectedField.key, properties);
  }



  // protected updateField(): void {
  //   const selectedField = this.selectedField();

  //   if (!selectedField) {
  //     return;
  //   }

  //   this.fieldKeyControl.markAsTouched();
  //   this.fieldLabelControl.markAsTouched();

  //   if (this.fieldKeyControl.invalid || this.fieldLabelControl.invalid) {
  //     return;
  //   }

  //   const newKey = this.fieldKeyControl.value.trim();

  //   const isAvailable = this.designerState.isFieldKeyAvailable(newKey, selectedField.key);

  //   if (!isAvailable) {
  //     this.fieldKeyControl.setErrors({
  //       duplicate: true,
  //     });

  //     return;
  //   }

  //   this.designerState.updateField(selectedField.key, {
  //     key: newKey,
  //     label: this.fieldLabelControl.value.trim(),
  //   });
  // }
}
