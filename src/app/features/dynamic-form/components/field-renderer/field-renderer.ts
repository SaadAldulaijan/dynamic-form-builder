import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { asyncScheduler, observeOn } from 'rxjs';
import { FieldSchema } from '../../models/form-schema';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder';
import { DynamicFormRuleEngineService } from '../../services/dynamic-form-rule-engine';
import { TranslateService } from '@ngx-translate/core';
import { DynamicFormIntegrationService } from '../../services/dynamic-form-integration';
import { FieldActionSchema } from '../../models/actions/field-action';
import { ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';
import { TextControl } from './controls/text-control/text-control';
import { TextareaControl } from './controls/textarea-control/textarea-control';
import { NumberControl } from './controls/number-control/number-control';
import { DropdownControl } from './controls/dropdown-control/dropdown-control';
import { RadioControl } from './controls/radio-control/radio-control';
import { CheckboxControl } from './controls/checkbox-control/checkbox-control';
import { MultiselectControl } from './controls/multiselect-control/multiselect-control';
import { DateControl } from "./controls/date-control/date-control";
import { FileControl } from "./controls/file-control/file-control";
import { JsonViewerControl } from './controls/json-viewer-control/json-viewer-control';
import { GroupControl } from './controls/group-control/group-control';
import { ArrayControl } from './controls/array-control/array-control';
import { GoogleMapControl } from './controls/google-map-control/google-map-control';


@Component({
  selector: 'app-field-renderer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TextControl,
    TextareaControl,
    NumberControl,
    DropdownControl,
    RadioControl,
    CheckboxControl,
    MultiselectControl,
    DateControl,
    FileControl,
    JsonViewerControl,
    GroupControl,
    ArrayControl,
    GoogleMapControl
],
  templateUrl: './field-renderer.html',
  styleUrls: ['./field-renderer.scss']
})
export class FieldRenderer {
  @Input({ required: true }) field!: FieldSchema;
  @Input({ required: true }) form!: FormGroup | any;
  @Input() allFields: FieldSchema[] = [];

  private dynamicFormBuilderService = inject(DynamicFormBuilderService);
  private ruleEngine = inject(DynamicFormRuleEngineService);
  private translate = inject(TranslateService);
  private integrationService = inject(DynamicFormIntegrationService);
  private cdr = inject(ChangeDetectorRef);


  lookupLoading = signal<Record<string, boolean>>({});
  lookupErrors = signal<Record<string, string | null>>({});
  lookupResults = signal<Record<string, any>>({});


  setLookupLoading(actionKey: string, value: boolean): void {
    this.lookupLoading.update(current => ({
      ...current,
      [actionKey]: value
    }));
  }

  setLookupError(actionKey: string, value: string | null): void {
    this.lookupErrors.update(current => ({
      ...current,
      [actionKey]: value
    }));
  }

  setLookupResult(fieldKey: string, value: any): void {
    this.lookupResults.update(current => ({
      ...current,
      [fieldKey]: value
    }));
  }


  getActionLabel(action: FieldActionSchema): string {
    if (action.labelKey) {
      return this.translate.instant(action.labelKey);
    }

    return action.label ?? action.key;
  }

  executeAction(action: FieldActionSchema): void {
    if (action.type !== 'apiLookup') {
      return;
    }

    const sourceControl = this.form.get(this.field.key);
    sourceControl?.markAsTouched();
    sourceControl?.updateValueAndValidity({
      emitEvent: true,
    });

    if (sourceControl?.invalid) {
      return;
    }

    const payload = this.buildActionPayload(action);

    this.setLookupLoading(action.key, true);
    this.setLookupError(action.key, null);

    this.integrationService.execute(action.endpointKey, payload).pipe(
      // Ensure response side effects run in a later async turn.
      observeOn(asyncScheduler)
    ).subscribe({
      next: response => {

        this.handleLookupResponse(action, response);

        this.setLookupLoading(action.key, false);
        this.cdr.markForCheck();
      },
      error: error => {
        this.setLookupError(action.key, error?.message ?? 'Lookup failed');
        this.setLookupLoading(action.key, false);
        this.cdr.markForCheck();
      }
    });
  }

  handleArrayMappings(action: FieldActionSchema, response: any): void {
    const arrayMapping = action.responseHandling?.arrayMapping;

    if (!arrayMapping) {
      return;
    }

    for (const mapping of Object.values(arrayMapping)) {
      const sourceValue = this.getValueByPath(response, mapping.sourcePath);

      if (!Array.isArray(sourceValue)) {
        continue;
      }

      const targetControl = this.form.get(mapping.targetField) as FormArray | null;

      if (!targetControl) {
        continue;
      }

      const targetField = this.findFieldByKey(mapping.targetField);

      if (!targetField || targetField.type !== 'array') {
        continue;
      }

      targetControl.clear();

      for (const item of sourceValue) {
        const itemGroup = this.dynamicFormBuilderService.buildGroup(
          targetField.itemSchema.fields
        );

        this.ruleEngine.setupRules(
          targetField.itemSchema.fields,
          itemGroup
        );

        itemGroup.patchValue(item, {
          emitEvent: false
        });

        if (action.responseHandling?.disableMappedFields || targetField.state?.readonly) {
          itemGroup.disable({
            emitEvent: false
          });
        }

        targetControl.push(itemGroup);
      }

      targetControl.markAsTouched();
      targetControl.updateValueAndValidity({
        emitEvent: false
      });
    }
  }


  findFieldByKey(fieldKey: string): FieldSchema | null {
    return this.findFieldByKeyRecursive(this.allFields, fieldKey);
  }

  findFieldByKeyRecursive(fields: FieldSchema[], fieldKey: string): FieldSchema | null {
    for (const field of fields) {
      if (field.key === fieldKey) {
        return field;
      }

      if (field.type === 'group') {
        const found = this.findFieldByKeyRecursive(field.fields, fieldKey);

        if (found) {
          return found;
        }
      }

      if (field.type === 'array') {
        const found = this.findFieldByKeyRecursive(
          field.itemSchema.fields,
          fieldKey
        );

        if (found) {
          return found;
        }
      }
    }

    return null;
  }


  handleLookupResponse(action: FieldActionSchema, response: any): void {
    // backward-compatible old mode
    if (action.targetField) {
      const targetControl = this.form.get(action.targetField);

      if (targetControl) {
        targetControl.setValue(response, {
          emitEvent: false
        });

        this.setLookupResult(action.targetField, response);
      }
    }

    const responseHandling = action.responseHandling;

    if (!responseHandling) {
      return;
    }

    if (responseHandling.jsonViewerField) {
      const jsonViewerControl = this.form.get(responseHandling.jsonViewerField);

      if (jsonViewerControl) {
        jsonViewerControl.setValue(response, {
          emitEvent: false
        });

        this.setLookupResult(responseHandling.jsonViewerField, response);
      }
    }

    if (responseHandling.mapping) {
      for (const [formFieldKey, responsePath] of Object.entries(responseHandling.mapping)) {
        const control = this.form.get(formFieldKey);

        if (!control) {
          continue;
        }

        const value = this.getValueByPath(response, responsePath);

        control.setValue(value, {
          emitEvent: false
        });

        control.markAsTouched();
        control.updateValueAndValidity({
          emitEvent: false
        });

        if (responseHandling.disableMappedFields) {
          control.disable({
            emitEvent: false
          });
        }
      }
    }

    this.handleArrayMappings(action, response);
  }


  getValueByPath(source: any, path: string): any {
    if (!source || !path) {
      return null;
    }

    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, source);
  }

  buildActionPayload(action: FieldActionSchema): any {
    const payload: Record<string, any> = {};

    for (const [requestKey, formFieldKey] of Object.entries(action.requestMapping)) {
      payload[requestKey] = this.form.get(formFieldKey)?.value;
    }

    return payload;
  }

  isActionLoading(action: FieldActionSchema): boolean {
    return this.lookupLoading()[action.key] === true;
  }

  getActionError(action: FieldActionSchema): string | null {
    return this.lookupErrors()[action.key] ?? null;
  }
}
