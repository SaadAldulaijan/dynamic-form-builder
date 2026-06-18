export interface DateValidation {
  minDate?: string;
  maxDate?: string;
  minDateToday?: boolean;
  maxDateToday?: boolean;
  dateGreaterThanField?: string;
  dateGreaterThanOrEqualField?: string;
  dateLessThanField?: string;
  dateLessThanOrEqualField?: string;
}