import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-designer-toolbar',
  imports: [],
  templateUrl: './designer-toolbar.html',
  styleUrls: ['./designer-toolbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignerToolbar {

  formTitle = input<string>('Untitled Form');
  isDirty = input<boolean>(false);
  isSaving = input<boolean>(false);
  isValidating = input<boolean>(false);

  canUndo = input<boolean>(false);
  canRedo = input<boolean>(false);

  back = output<void>();
  undo = output<void>();
  redo = output<void>();
  validate = output<void>();
  preview = output<void>();
  exportJson = output<void>();
  saveDraft = output<void>();

}
