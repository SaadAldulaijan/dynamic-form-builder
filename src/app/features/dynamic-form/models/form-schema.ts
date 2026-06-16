export type FieldType =
  | 'text'
  | 'number'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'array'
  | 'file'
  | 'date'
  | 'dateRange';

export interface FormSchema {
  title: string;
  fields?: FieldSchema[];
  sections?: FormSectionSchema[];
}

export interface FormSectionSchema {
  key: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
}

export interface FieldOption {
  label: string;
  value: any;
  parentValue?: any;
}

export interface FieldCondition {
  field: string;
  operator: 'equals' | 'notEquals';
  value: any;
}



export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: string; 
  options?: FieldOption[];
  dependsOn?: string;
  validations?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    startsWith?: string;
    exactLength?: number;
    email?: boolean;
    maxFileSizeMb?: number;
    allowedExtensions?: string[];

    minDate?: string;
    maxDate?: string;

    minDateToday?: boolean;
    maxDateToday?: boolean;

    dateGreaterThanField?: string;
    dateGreaterThanOrEqualField?: string;

    dateLessThanField?: string;
    dateLessThanOrEqualField?: string;
  };
  messages?: {
    [key: string]: string;
  };
  visibleWhen?: FieldCondition;
  requiredWhen?: FieldCondition;
  disabledWhen?: FieldCondition;
  clearValueWhenHidden?: boolean;
  itemSchema?: {
    fields: FieldSchema[];
  };
}