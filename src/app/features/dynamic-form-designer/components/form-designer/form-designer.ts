import { Component, signal } from '@angular/core';
import { DesignerToolbar } from '../designer-toolbar/designer-toolbar';
import { FieldPalette } from '../field-palette/field-palette';
import { FormCanvas } from '../form-canvas/form-canvas';
import { PropertiesPanel } from '../properties-panel/properties-panel';
import { FieldType } from '../../../dynamic-form/models/field-types';


@Component({
  selector: 'app-form-designer',
  imports: [DesignerToolbar, FieldPalette, FormCanvas, PropertiesPanel],
  templateUrl: './form-designer.html',
  styleUrls: ['./form-designer.scss'],
})
export class FormDesigner {
  protected readonly formTitle = signal('Untitled Form');
  protected readonly isDirty = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly isValidating = signal(false);

  protected readonly canUndo = signal(false);
  protected readonly canRedo = signal(false);

  protected onBack(): void {
    console.log('Back clicked');
  }

  protected onUndo(): void {
    console.log('Undo clicked');
  }

  protected onRedo(): void {
    console.log('Redo clicked');
  }

  protected onValidate(): void {
    console.log('Validate clicked');
  }

  protected onPreview(): void {
    console.log('Preview clicked');
  }

  protected onExportJson(): void {
    console.log('Export JSON clicked');
  }

  protected onSaveDraft(): void {
    console.log('Save draft clicked');
  }


  protected onFieldSelected(type: FieldType): void {
  console.log('Selected field type:', type);
}


}
