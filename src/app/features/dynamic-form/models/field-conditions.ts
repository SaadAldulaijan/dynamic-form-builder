import { FieldValue } from "./validations/field-value";



export type FieldCondition =
  | {
    field: string;
    operator: 'equals' | 'notEquals';
    value: FieldValue;
  }
  | {
    field: string;
    operator: 'in' | 'notIn';
    value: FieldValue[];
  };

export type FieldConditionExpression =
  | FieldCondition
  | FieldConditionGroup;

export interface FieldConditionGroup {
  logic: 'and' | 'or';
  conditions: FieldConditionExpression[];
}