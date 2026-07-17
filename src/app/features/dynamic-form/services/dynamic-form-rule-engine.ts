import { inject, Injectable } from "@angular/core";
import { DynamicFormBuilderService } from "./dynamic-form-builder";
import { FormGroup } from "@angular/forms";
import { FieldSchema } from '../models/form-schema';
import { FieldConditionExpression, FieldConditionGroup } from "../models/field-conditions";

@Injectable({
  providedIn: 'root'
})
export class DynamicFormRuleEngineService {

  private formBuilderService = inject(DynamicFormBuilderService);

  setupRules(fields: FieldSchema[], form: FormGroup): void {
    this.setupRulesForCurrentLevel(fields, form);

    for (const field of fields) {
      if (field.type !== 'group') {
        continue;
      }

      const group = form.get(field.key) as FormGroup | null;

      if (!group) continue;

      this.setupRules(field.fields ?? [], group);
    }
  }


  private setupRulesForCurrentLevel(fields: FieldSchema[], form: FormGroup): void {
    this.setupConditionalRequired(fields, form);
    this.setupConditionalDisabled(fields, form);
    this.setupClearHiddenValues(fields, form);
    this.setupDependencies(fields, form);
    this.setupDateFieldRules(fields, form);
    this.setupCalculatedFields(fields, form);
  }

  setupCalculatedFields(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {

      if (field.type !== 'number') continue;
      
      if (!field.calculatedFrom) continue;


      const targetControl = form.get(field.key);

      if (!targetControl) continue;


      targetControl.disable({ emitEvent: false });

      const calculate = () => {
        const result = this.evaluateCalculation(
          field.calculatedFrom!.expression,
          field.calculatedFrom!.fields,
          form
        );

        const precision = field.calculatedFrom?.precision;

        const finalValue =
          result === null
            ? null
            : precision !== undefined
              ? Number(result.toFixed(precision))
              : result;

        targetControl.setValue(finalValue);

        targetControl.updateValueAndValidity({
          emitEvent: false
        });
      };

      calculate();

      for (const dependencyField of field.calculatedFrom.fields) {
        const dependencyControl = form.get(dependencyField);

        if (!dependencyControl) {
          continue;
        }

        dependencyControl.valueChanges.subscribe(() => {
          calculate();
        });
      }
    }
  }

  evaluateCalculation(
    expression: string,
    dependencyFields: string[],
    form: FormGroup
  ): number | null {
    const values: Record<string, number> = {};

    for (const fieldKey of dependencyFields) {
      const rawValue = form.get(fieldKey)?.value;

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        return null;
      }

      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        return null;
      }

      values[fieldKey] = numericValue;
    }

    const normalizedExpression = expression.replace(/\s+/g, '');

    if (!this.isSafeMathExpression(normalizedExpression, dependencyFields)) {
      console.error(`Unsafe calculated field expression: ${expression}`);
      return null;
    }

    const expressionWithValues = normalizedExpression.replace(
      /[a-zA-Z_][a-zA-Z0-9_]*/g,
      match => values[match].toString()
    );

    try {
      return Function(`"use strict"; return (${expressionWithValues});`)();
    } catch {
      return null;
    }
  }

  isSafeMathExpression(expression: string, allowedFields: string[]): boolean {
    const allowedCharactersRegex = /^[a-zA-Z0-9_+\-*/().]+$/;

    if (!allowedCharactersRegex.test(expression)) {
      return false;
    }

    const tokens = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];

    return tokens.every(token => allowedFields.includes(token));
  }

  setupDateFieldRules(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {

      if (field.type !== 'date') continue;

      const validations = field.validations;

      if (!validations) continue;


      const targetControl = form.get(field.key);

      if (!targetControl) continue;


      const dependencyFields = [
        ...new Set(validations.comparisons?.map(comparison => comparison.field) ?? [])
      ];

      for (const dependencyField of dependencyFields) {
        const dependencyControl = form.get(dependencyField);

        if (!dependencyControl) continue;


        dependencyControl.valueChanges.subscribe(() => {
          targetControl.updateValueAndValidity({
            emitEvent: false
          });
        });
      }
    }
  }

  evaluateCondition(condition: FieldConditionExpression, form: FormGroup): boolean {
    if (this.isConditionGroup(condition)) {
      const results = condition.conditions.map(childCondition =>
        this.evaluateCondition(childCondition, form)
      );

      return condition.logic === 'and'
        ? results.every(Boolean)
        : results.some(Boolean);
    }

    const actualValue = form.get(condition.field)?.value;

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;

      case 'notEquals':
        return actualValue !== condition.value;


      case 'in':
        return Array.isArray(condition.value)
          && condition.value.includes(actualValue);

      case 'notIn':
        return Array.isArray(condition.value)
          && !condition.value.includes(actualValue);

      default:
        return false;
    }
  }

  private isConditionGroup(condition: FieldConditionExpression): condition is FieldConditionGroup {
    return 'conditions' in condition;
  }

  private getConditionFieldKeys(
    condition: FieldConditionExpression,
    fieldKeys = new Set<string>()
  ): Set<string> {
    if (this.isConditionGroup(condition)) {
      for (const childCondition of condition.conditions) {
        this.getConditionFieldKeys(childCondition, fieldKeys);
      }

      return fieldKeys;
    }

    fieldKeys.add(condition.field);

    return fieldKeys;
  }

  private subscribeToConditionChanges(
    condition: FieldConditionExpression,
    form: FormGroup,
    callback: () => void
  ): void {
    for (const fieldKey of this.getConditionFieldKeys(condition)) {
      form.get(fieldKey)?.valueChanges.subscribe(() => {
        callback();
      });
    }
  }

  setupConditionalRequired(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.requiredWhen) continue;

      const targetControl = form.get(field.key);

      if (!targetControl) continue;

      const applyRequiredState = () => {
        const shouldBeRequired = this.evaluateCondition(field.requiredWhen!, form);

        targetControl.setValidators(
          this.formBuilderService.buildValidators(field, shouldBeRequired)
        );

        targetControl.updateValueAndValidity({ emitEvent: false });
      };

      applyRequiredState();

      this.subscribeToConditionChanges(field.requiredWhen, form, applyRequiredState);
    }
  }

  setupConditionalDisabled(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.disabledWhen) continue;

      const targetControl = form.get(field.key);

      if (!targetControl) continue;

      const applyDisabledState = () => {
        const shouldBeDisabled = this.evaluateCondition(field.disabledWhen!, form);

        if (shouldBeDisabled) {
          targetControl.disable({ emitEvent: false });
        } else {
          targetControl.enable({ emitEvent: false });

          const shouldBeRequired = field.requiredWhen ? this.evaluateCondition(field.requiredWhen, form) : false;

          targetControl.setValidators(this.formBuilderService.buildValidators(field, shouldBeRequired));
        }

        targetControl.updateValueAndValidity({ emitEvent: false });
      };

      applyDisabledState();

      this.subscribeToConditionChanges(field.disabledWhen, form, applyDisabledState);
    }
  }

  setupClearHiddenValues(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.visibleWhen || !field.clearValueWhenHidden) continue;

      const targetControl = form.get(field.key);

      if (!targetControl) continue;

      const clearIfHidden = () => {
        const isVisible = this.evaluateCondition(field.visibleWhen!, form);

        if (!isVisible) {
          targetControl.reset(null, { emitEvent: false });
          targetControl.markAsUntouched();
          targetControl.markAsPristine();
        }
      };

      clearIfHidden();

      this.subscribeToConditionChanges(field.visibleWhen, form, clearIfHidden);
    }
  }

  setupDependencies(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {

      if (field.type !== 'dropdown') continue;

      if (!field.dependency?.field) continue;

      const parentControl = form.get(field.dependency.field);
      const childControl = form.get(field.key);

      if (!parentControl || !childControl) continue;

      let previousValue = parentControl.value;

      parentControl.valueChanges.subscribe(currentValue => {
        if (currentValue === previousValue) return;

        previousValue = currentValue;

        childControl.setValue(null, { emitEvent: false });
        childControl.markAsUntouched();
        childControl.markAsPristine();
      });
    }
  }

}