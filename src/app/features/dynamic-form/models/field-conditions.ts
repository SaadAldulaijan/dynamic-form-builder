export type FieldConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn';

export interface FieldCondition {
  field: string;
  operator: FieldConditionOperator;
  value: any;
}