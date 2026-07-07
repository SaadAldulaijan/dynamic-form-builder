export type FieldActionType = 'apiLookup';
export interface FieldActionSchema {
  key: string;
  type: FieldActionType;

  label?: string;
  labelKey?: string;

  endpointKey: string;

  requestMapping: Record<string, string>;

  targetField?: string;
  responseHandling?: ApiLookupResponseHandling;
}


export interface ApiLookupResponseHandling {
  jsonViewerField?: string;
  mapping?: Record<string, string>;
  arrayMapping?: Record<string, ApiLookupArrayMapping>;
  disableMappedFields?: boolean;
}

export interface ApiLookupArrayMapping {
  sourcePath: string;
  targetField: string;
}