export type FieldConditionOperator =
  | 'equals'
  | 'notEquals';

export interface FieldCondition {
  field: string;
  operator: FieldConditionOperator;
  value: any;
}