export interface TextValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  startsWith?: string;
  exactLength?: number;
  email?: boolean;
}
