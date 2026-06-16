import { Injectable } from "@angular/core";
import { DynamicFormBuilderService } from "./dynamic-form-builder";
import { FieldCondition, FieldSchema } from "../models/form-schema";
import { FormGroup } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class DynamicFormRuleEngineService {
  constructor(private formBuilderService: DynamicFormBuilderService) { }

  setupRules(fields: FieldSchema[], form: FormGroup): void {
    this.setupConditionalRequired(fields, form);
    this.setupConditionalDisabled(fields, form);
    this.setupClearHiddenValues(fields, form);
    this.setupDependencies(fields, form);
    this.setupDateFieldRules(fields, form);
  }

  setupDateFieldRules(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      const validations = field.validations;

      if (!validations) {
        continue;
      }

      const targetControl = form.get(field.key);

      if (!targetControl) {
        continue;
      }

      const dependencyFields = [
        validations.dateGreaterThanField,
        validations.dateGreaterThanOrEqualField,
        validations.dateLessThanField,
        validations.dateLessThanOrEqualField
      ].filter(Boolean) as string[];

      for (const dependencyField of dependencyFields) {
        const dependencyControl = form.get(dependencyField);

        if (!dependencyControl) {
          continue;
        }

        dependencyControl.valueChanges.subscribe(() => {
          targetControl.updateValueAndValidity({
            emitEvent: false
          });
        });
      }
    }
  }

  evaluateCondition(condition: FieldCondition, form: FormGroup): boolean {
    const actualValue = form.get(condition.field)?.value;

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;

      case 'notEquals':
        return actualValue !== condition.value;

      default:
        return false;
    }
  }

  setupConditionalRequired(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.requiredWhen) continue;

      const targetControl = form.get(field.key);
      const sourceControl = form.get(field.requiredWhen.field);

      if (!targetControl || !sourceControl) continue;

      const applyRequiredState = () => {
        const shouldBeRequired = this.evaluateCondition(field.requiredWhen!, form);

        targetControl.setValidators(
          this.formBuilderService.buildValidators(field, shouldBeRequired)
        );

        targetControl.updateValueAndValidity({ emitEvent: false });
      };

      applyRequiredState();

      sourceControl.valueChanges.subscribe(() => {
        applyRequiredState();
      });
    }
  }

  setupConditionalDisabled(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.disabledWhen) continue;

      const targetControl = form.get(field.key);
      const sourceControl = form.get(field.disabledWhen.field);

      if (!targetControl || !sourceControl) continue;

      const applyDisabledState = () => {
        const shouldBeDisabled = this.evaluateCondition(field.disabledWhen!, form);

        if (shouldBeDisabled) {
          targetControl.disable({ emitEvent: false });
        } else {
          targetControl.enable({ emitEvent: false });
        }

        targetControl.updateValueAndValidity({ emitEvent: false });
      };

      applyDisabledState();

      sourceControl.valueChanges.subscribe(() => {
        applyDisabledState();
      });
    }
  }

  setupClearHiddenValues(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.visibleWhen || !field.clearValueWhenHidden) continue;

      const targetControl = form.get(field.key);
      const sourceControl = form.get(field.visibleWhen.field);

      if (!targetControl || !sourceControl) continue;

      const clearIfHidden = () => {
        const isVisible = this.evaluateCondition(field.visibleWhen!, form);

        if (!isVisible) {
          targetControl.reset(null, { emitEvent: false });
          targetControl.markAsUntouched();
          targetControl.markAsPristine();
        }
      };

      clearIfHidden();

      sourceControl.valueChanges.subscribe(() => {
        clearIfHidden();
      });
    }
  }

  setupDependencies(fields: FieldSchema[], form: FormGroup): void {
    for (const field of fields) {
      if (!field.dependsOn) continue;

      const parentControl = form.get(field.dependsOn);
      const childControl = form.get(field.key);

      if (!parentControl || !childControl) {
        continue;
      }

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



  // setupDependencies(): void {
  //   for (const field of this.getAllFields()) {
  //     if (!field.dependsOn) {
  //       continue;
  //     }

  //     const parentControl = this.form.get(field.dependsOn);
  //     const childControl = this.form.get(field.key);

  //     if (!parentControl || !childControl) {
  //       continue;
  //     }

  //     let previousValue = parentControl.value;

  //     parentControl.valueChanges.subscribe(currentValue => {
  //       if (currentValue === previousValue) {
  //         return;
  //       }

  //       previousValue = currentValue;

  //       childControl.setValue(null, {
  //         emitEvent: false
  //       });

  //       childControl.markAsUntouched();
  //       childControl.markAsPristine();
  //     });
  //   }
  // }

}