export type IsoDateString =
    `${number}-${number}-${number}`;


export interface DateValidation {
  minDate?: IsoDateString;
  maxDate?: IsoDateString;
  minDateToday?: boolean;
  maxDateToday?: boolean;
  comparisons?: DateFieldComparison[];
  // dateGreaterThanField?: string;
  // dateGreaterThanOrEqualField?: string;
  // dateLessThanField?: string;
  // dateLessThanOrEqualField?: string;
}


export type DateComparisonOperator =
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual';


export interface DateFieldComparison {
  field: string;
  operator: DateComparisonOperator;
}