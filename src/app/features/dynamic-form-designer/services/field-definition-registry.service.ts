import { Injectable } from '@angular/core';
import { FIELD_DEFINITIONS } from '../registries/field-definitions';
import { FieldCategory } from '../models/field-category';
import { FieldDefinition } from '../models/field-definition';
import { FieldType } from '../../dynamic-form/models/field-types';
import { FieldSchema } from '../../dynamic-form/models/form-schema';

@Injectable({
  providedIn: 'root',
})
export class FieldDefinitionRegistryService {
  private readonly definitions = FIELD_DEFINITIONS;

  getAll(): readonly FieldDefinition[] {
    return this.definitions;
  }

  getByCategory(category: FieldCategory): readonly FieldDefinition[] {
    return this.definitions.filter(
      definition => definition.category === category,
    );
  }

  getByType(type: FieldType): FieldDefinition {
    const definition = this.definitions.find(
      item => item.type === type,
    );

    if (!definition) {
      throw new Error(`Field definition is not registered: ${type}`);
    }

    return definition;
  }

  createField(type: FieldType): FieldSchema {
    return structuredClone(
      this.getByType(type).createDefault(),
    );
  }
}


