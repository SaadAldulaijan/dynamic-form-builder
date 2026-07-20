import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormDesignerStateService } from '../../services/form-designer-state.service';

@Component({
  selector: 'app-form-canvas',
  imports: [],
  templateUrl: './form-canvas.html',
  styleUrls: ['./form-canvas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCanvas {
  private readonly designerState = inject(FormDesignerStateService);

  protected readonly schema = this.designerState.schema;

  protected readonly selectedNode = this.designerState.selectedNode;

  protected selectForm(): void {
    this.designerState.selectForm();
  }

  protected selectSection(sectionKey: string): void {
    this.designerState.selectSection(sectionKey);
  }

  protected selectField(fieldKey: string, sectionKey: string): void {
    this.designerState.selectField(fieldKey, sectionKey);
  }

  protected isSectionSelected(sectionKey: string): boolean {
    const selectedNode = this.selectedNode();

    return selectedNode?.type === 'section' && selectedNode.sectionKey === sectionKey;
  }

  protected isFieldSelected(fieldKey: string): boolean {
    const selectedNode = this.selectedNode();

    return selectedNode?.type === 'field' && selectedNode.fieldKey === fieldKey;
  }

  protected moveFieldUp(fieldKey: string, sectionKey: string): void {
    this.designerState.moveFieldUp(fieldKey, sectionKey);
  }

  protected moveFieldDown(fieldKey: string, sectionKey: string): void {
    this.designerState.moveFieldDown(fieldKey, sectionKey);
  }

  protected duplicateField(fieldKey: string, sectionKey: string): void {
    this.designerState.duplicateField(fieldKey, sectionKey);
  }

  // protected deleteField(fieldKey: string, sectionKey: string): void {
  //   this.designerState.deleteField(fieldKey, sectionKey);
  // }

  protected deleteField(fieldKey: string, sectionKey: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this field?');

    if (!confirmed) {
      return;
    }

    this.designerState.deleteField(fieldKey, sectionKey);
  }

  protected canMoveFieldUp(fieldKey: string, sectionKey: string): boolean {
    return this.designerState.canMoveFieldUp(fieldKey, sectionKey);
  }

  protected canMoveFieldDown(fieldKey: string, sectionKey: string): boolean {
    return this.designerState.canMoveFieldDown(fieldKey, sectionKey);
  }


  protected addSection(): void {
    this.designerState.addSection();
  }

  protected moveSectionUp(sectionKey: string): void {
    this.designerState.moveSectionUp(sectionKey);
  }

  protected moveSectionDown(sectionKey: string): void {
    this.designerState.moveSectionDown(sectionKey);
  }

  protected duplicateSection(sectionKey: string): void {
    this.designerState.duplicateSection(sectionKey);
  }

  protected deleteSection(sectionKey: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this section and all its fields?');

    if (!confirmed) {
      return;
    }

    this.designerState.deleteSection(sectionKey);
  }

  protected canMoveSectionUp(sectionKey: string): boolean {
    return this.designerState.canMoveSectionUp(sectionKey);
  }

  protected canMoveSectionDown(sectionKey: string): boolean {
    return this.designerState.canMoveSectionDown(sectionKey);
  }


  protected canDeleteSection(): boolean {
    return this.designerState.canDeleteSection();
  }



}
