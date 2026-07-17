import { Injectable, inject, signal, computed } from '@angular/core';
import { FieldDefinitionRegistryService } from './field-definition-registry.service';
import type {
  FormSchema,
  SectionedFormSchema,
  FieldSchema,
} from '../../dynamic-form/models/form-schema';
import { generateUniqueFieldKey } from '../utils/field-key.util';
import type { DesignerNode } from '../models/designer-node';
import { FieldType } from '../../dynamic-form/models/field-types';

@Injectable({
  providedIn: 'root',
})
export class FormDesignerStateService {
  private readonly fieldRegistry = inject(FieldDefinitionRegistryService);

  private readonly schemaState = signal<FormSchema>(this.createInitialSchema());

  private readonly selectedNodeState = signal<DesignerNode | null>({
    type: 'form',
  });

  private readonly dirtyState = signal(false);

  readonly schema = this.schemaState.asReadonly();
  readonly selectedNode = this.selectedNodeState.asReadonly();
  readonly isDirty = this.dirtyState.asReadonly();

  readonly sections = computed(() => {
    const schema = this.schemaState();

    return this.isSectionedSchema(schema) ? schema.sections : [];
  });

  readonly selectedField = computed(() => {
    const selectedNode = this.selectedNodeState();

    if (!selectedNode || selectedNode.type !== 'field') {
      return null;
    }

    return this.findField(selectedNode.fieldKey);
  });

  addField(type: FieldType): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      throw new Error('The current designer only supports sectioned forms.');
    }

    const field = this.fieldRegistry.createField(type);

    field.key = generateUniqueFieldKey(currentSchema, type);

    const targetSection = this.resolveTargetSection(currentSchema);

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((section) =>
        section.key === targetSection.key
          ? {
              ...section,
              fields: [...section.fields, field],
            }
          : section,
      ),
    };

    this.schemaState.set(updatedSchema);

    this.selectedNodeState.set({
      type: 'field',
      fieldKey: field.key,
      sectionKey: targetSection.key,
    });

    this.dirtyState.set(true);
  }

  updateForm(changes: Partial<Pick<SectionedFormSchema, 'key' | 'title'>>): void {
    const currentSchema = this.schemaState();

    this.schemaState.set({
      ...currentSchema,
      ...changes,
    });

    this.dirtyState.set(true);
  }

  updateSection(
    sectionKey: string,
    changes: {
      key?: string;
      title?: string;
      description?: string;
    },
  ): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      return;
    }

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              ...changes,
            }
          : section,
      ),
    };

    this.schemaState.set(updatedSchema);

    if (changes.key && changes.key !== sectionKey) {
      this.selectedNodeState.set({
        type: 'section',
        sectionKey: changes.key,
      });
    }

    this.dirtyState.set(true);
  }

  selectForm(): void {
    this.selectedNodeState.set({
      type: 'form',
    });
  }

  selectSection(sectionKey: string): void {
    this.selectedNodeState.set({
      type: 'section',
      sectionKey,
    });
  }

  selectField(fieldKey: string, sectionKey?: string): void {
    this.selectedNodeState.set({
      type: 'field',
      fieldKey,
      sectionKey,
    });
  }

  private createInitialSchema(): SectionedFormSchema {
    return {
      key: 'untitledForm',
      version: 1,
      title: 'Untitled Form',
      sections: [
        {
          key: 'section1',
          title: 'Section 1',
          fields: [],
        },
      ],
    };
  }

  updateField(fieldKey: string, changes: Partial<FieldSchema>): void {
    const currentSchema = this.schemaState();

    const updatedSchema = this.mapFields(currentSchema, (field) =>
      field.key === fieldKey
        ? ({
            ...field,
            ...changes,
          } as FieldSchema)
        : field,
    );

    this.schemaState.set(updatedSchema);

    if (changes.key && changes.key !== fieldKey) {
      const currentSelection = this.selectedNodeState();

      this.selectedNodeState.set({
        type: 'field',
        fieldKey: changes.key,
        sectionKey: currentSelection?.type === 'field' ? currentSelection.sectionKey : undefined,
      });
    }

    this.dirtyState.set(true);
  }

  isFieldKeyAvailable(key: string, currentFieldKey?: string): boolean {
    const normalizedKey = key.trim();

    if (!normalizedKey) {
      return false;
    }

    const allKeys = this.getAllFieldKeys(this.schemaState());

    if (currentFieldKey && normalizedKey === currentFieldKey) {
      return true;
    }

    return !allKeys.has(normalizedKey);
  }

  private mapFields(schema: FormSchema, mapper: (field: FieldSchema) => FieldSchema): FormSchema {
    if (!this.isSectionedSchema(schema)) {
      return {
        ...schema,
        fields: schema.fields.map((field) => this.mapFieldRecursively(field, mapper)),
      };
    }

    return {
      ...schema,
      sections: schema.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => this.mapFieldRecursively(field, mapper)),
      })),
    };
  }

  private mapFieldRecursively(
    field: FieldSchema,
    mapper: (field: FieldSchema) => FieldSchema,
  ): FieldSchema {
    let mappedField = mapper(field);

    if (mappedField.type === 'group') {
      mappedField = {
        ...mappedField,
        fields: mappedField.fields.map((child) => this.mapFieldRecursively(child, mapper)),
      };
    }

    if (mappedField.type === 'array') {
      mappedField = {
        ...mappedField,
        itemSchema: {
          ...mappedField.itemSchema,
          fields: mappedField.itemSchema.fields.map((child) =>
            this.mapFieldRecursively(child, mapper),
          ),
        },
      };
    }

    return mappedField;
  }

  private getAllFieldKeys(schema: FormSchema): Set<string> {
    const keys = new Set<string>();

    const collect = (fields: FieldSchema[]): void => {
      for (const field of fields) {
        keys.add(field.key);

        if (field.type === 'group') {
          collect(field.fields);
        }

        if (field.type === 'array') {
          collect(field.itemSchema.fields);
        }
      }
    };

    if (!this.isSectionedSchema(schema)) {
      collect(schema.fields);
    } else {
      for (const section of schema.sections) {
        collect(section.fields);
      }
    }

    return keys;
  }

  readonly selectedSection = computed(() => {
    const selectedNode = this.selectedNodeState();

    if (!selectedNode || selectedNode.type !== 'section') {
      return null;
    }

    const schema = this.schemaState();

    if (!this.isSectionedSchema(schema)) {
      return null;
    }

    return schema.sections.find((section) => section.key === selectedNode.sectionKey) ?? null;
  });

  private isSectionedSchema(schema: FormSchema): schema is SectionedFormSchema {
    return Array.isArray(schema.sections);
  }

  private resolveTargetSection(schema: SectionedFormSchema) {
    const selectedNode = this.selectedNodeState();

    if (selectedNode?.type === 'section' || selectedNode?.type === 'field') {
      const selectedSection = schema.sections.find(
        (section) => section.key === selectedNode.sectionKey,
      );

      if (selectedSection) {
        return selectedSection;
      }
    }

    const firstSection = schema.sections[0];

    if (!firstSection) {
      throw new Error('The form must contain at least one section.');
    }

    return firstSection;
  }

  private findField(fieldKey: string): FieldSchema | null {
    const schema = this.schemaState();

    if (!this.isSectionedSchema(schema)) {
      if (!schema.fields) {
        return null;
      }

      return schema.fields.find((field) => field.key === fieldKey) ?? null;
    }

    for (const section of schema.sections) {
      const field = section.fields.find((item) => item.key === fieldKey);

      if (field) {
        return field;
      }
    }

    return null;
  }

  moveFieldUp(fieldKey: string, sectionKey: string): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      return;
    }

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((section) => {
        if (section.key !== sectionKey) {
          return section;
        }

        const fieldIndex = section.fields.findIndex((field) => field.key === fieldKey);

        if (fieldIndex <= 0) {
          return section;
        }

        const fields = [...section.fields];

        [fields[fieldIndex - 1], fields[fieldIndex]] = [fields[fieldIndex], fields[fieldIndex - 1]];

        return {
          ...section,
          fields,
        };
      }),
    };

    this.schemaState.set(updatedSchema);
    this.dirtyState.set(true);
  }

  moveFieldDown(fieldKey: string, sectionKey: string): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      return;
    }

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((section) => {
        if (section.key !== sectionKey) {
          return section;
        }

        const fieldIndex = section.fields.findIndex((field) => field.key === fieldKey);

        if (fieldIndex < 0 || fieldIndex >= section.fields.length - 1) {
          return section;
        }

        const fields = [...section.fields];

        [fields[fieldIndex], fields[fieldIndex + 1]] = [fields[fieldIndex + 1], fields[fieldIndex]];

        return {
          ...section,
          fields,
        };
      }),
    };

    this.schemaState.set(updatedSchema);
    this.dirtyState.set(true);
  }

  duplicateField(fieldKey: string, sectionKey: string): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      return;
    }

    const section = currentSchema.sections.find((item) => item.key === sectionKey);

    if (!section) {
      return;
    }

    const fieldIndex = section.fields.findIndex((field) => field.key === fieldKey);

    if (fieldIndex < 0) {
      return;
    }

    const sourceField = section.fields[fieldIndex];

    // const duplicatedField = structuredClone(sourceField);

    // duplicatedField.key = generateUniqueFieldKey(currentSchema, sourceField.type);

    // if ('label' in duplicatedField) {
    //   duplicatedField.label = `${sourceField.label ?? sourceField.key} Copy`;
    // }

    const duplicatedField: FieldSchema = {
      ...structuredClone(sourceField),
      key: generateUniqueFieldKey(currentSchema, sourceField.type),
    };

    if (duplicatedField.label) {
      duplicatedField.label = `${duplicatedField.label} Copy`;
    }

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((item) => {
        if (item.key !== sectionKey) {
          return item;
        }

        const fields = [...item.fields];

        fields.splice(fieldIndex + 1, 0, duplicatedField);

        return {
          ...item,
          fields,
        };
      }),
    };

    this.schemaState.set(updatedSchema);

    this.selectedNodeState.set({
      type: 'field',
      fieldKey: duplicatedField.key,
      sectionKey,
    });

    this.dirtyState.set(true);
  }

  deleteField(fieldKey: string, sectionKey: string): void {
    const currentSchema = this.schemaState();

    if (!this.isSectionedSchema(currentSchema)) {
      return;
    }

    const updatedSchema: SectionedFormSchema = {
      ...currentSchema,
      sections: currentSchema.sections.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              fields: section.fields.filter((field) => field.key !== fieldKey),
            }
          : section,
      ),
    };

    this.schemaState.set(updatedSchema);

    this.selectedNodeState.set({
      type: 'section',
      sectionKey,
    });

    this.dirtyState.set(true);
  }

  canMoveFieldUp(fieldKey: string, sectionKey: string): boolean {
    const section = this.findSection(sectionKey);

    if (!section) {
      return false;
    }

    return section.fields.findIndex((field) => field.key === fieldKey) > 0;
  }

  canMoveFieldDown(fieldKey: string, sectionKey: string): boolean {
    const section = this.findSection(sectionKey);

    if (!section) {
      return false;
    }

    const fieldIndex = section.fields.findIndex((field) => field.key === fieldKey);

    return fieldIndex >= 0 && fieldIndex < section.fields.length - 1;
  }

  private findSection(sectionKey: string) {
    const schema = this.schemaState();

    if (!this.isSectionedSchema(schema)) {
      return null;
    }

    return schema.sections.find((section) => section.key === sectionKey) ?? null;
  }
}
