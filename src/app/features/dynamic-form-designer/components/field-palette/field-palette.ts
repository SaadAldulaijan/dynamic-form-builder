import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { FieldDefinitionRegistryService } from '../../services/field-definition-registry.service';
import { FieldType } from '../../../dynamic-form/models/field-types';


@Component({
  selector: 'app-field-palette',
  imports: [],
  templateUrl: './field-palette.html',
  styleUrls: ['./field-palette.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldPalette {
  private readonly fieldRegistry = inject(FieldDefinitionRegistryService);

  fieldSelected = output<FieldType>();

  protected readonly basicFields = computed(() =>
    this.fieldRegistry.getByCategory('basic'),
  );

  protected readonly selectionFields = computed(() =>
    this.fieldRegistry.getByCategory('selection'),
  );

  protected selectField(type: FieldType): void {
    this.fieldSelected.emit(type);
  }
}
