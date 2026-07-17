import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDesignerStateService } from '../../services/form-designer-state.service';

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

  protected readonly fieldKeyControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)],
  });

  protected readonly fieldLabelControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    // this.loadSelectedValues();

    effect(() => {
      this.selectedNode();
      this.schema();

      this.loadSelectedValues();
    });
  }

  protected loadSelectedValues(): void {
    const selectedNode = this.selectedNode();

    if (!selectedNode) {
      return;
    }

    if (selectedNode.type === 'form') {
      const schema = this.schema();

      this.formKeyControl.setValue(schema.key, {
        emitEvent: false,
      });

      this.formTitleControl.setValue(schema.title ?? '', {
        emitEvent: false,
      });

      return;
    }

    if (selectedNode.type === 'section') {
      const section = this.selectedSection();

      if (!section) {
        return;
      }

      this.sectionKeyControl.setValue(section.key, {
        emitEvent: false,
      });

      this.sectionTitleControl.setValue(section.title ?? '', {
        emitEvent: false,
      });

      this.sectionDescriptionControl.setValue(section.description ?? '', {
        emitEvent: false,
      });

      return;
    }

    const field = this.selectedField();

    if (!field) {
      return;
    }

    this.fieldKeyControl.setValue(field.key, {
      emitEvent: false,
    });

    this.fieldLabelControl.setValue(field.label ?? '', {
      emitEvent: false,
    });
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

    this.designerState.updateSection(selectedSection.key, {
      key: this.sectionKeyControl.value.trim(),
      title: this.sectionTitleControl.value.trim(),
      description: this.sectionDescriptionControl.value.trim() || undefined,
    });
  }

  protected updateField(): void {
    const selectedField = this.selectedField();

    if (!selectedField) {
      return;
    }

    this.fieldKeyControl.markAsTouched();
    this.fieldLabelControl.markAsTouched();

    if (this.fieldKeyControl.invalid || this.fieldLabelControl.invalid) {
      return;
    }

    const newKey = this.fieldKeyControl.value.trim();

    const isAvailable = this.designerState.isFieldKeyAvailable(newKey, selectedField.key);

    if (!isAvailable) {
      this.fieldKeyControl.setErrors({
        duplicate: true,
      });

      return;
    }

    this.designerState.updateField(selectedField.key, {
      key: newKey,
      label: this.fieldLabelControl.value.trim(),
    });
  }
}
