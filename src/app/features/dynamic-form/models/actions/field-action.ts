export type FieldActionType = 'apiLookup';
export interface FieldActionSchema {
  key: string;
  type: FieldActionType;

  label?: string;
  labelKey?: string;

  endpointKey: string;

  requestMapping: Record<string, string>;

  targetField: string;
}