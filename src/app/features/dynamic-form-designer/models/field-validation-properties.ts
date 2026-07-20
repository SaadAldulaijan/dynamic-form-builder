export interface FieldValidationProperties {
    required: boolean;

    minLength?: number;
    maxLength?: number;
    pattern?: string;

    min?: number;
    max?: number;
    allowDecimal?: boolean;
    decimalPrecision?: number;

    maxFileSize?: number;
    allowedExtensions?: string[];

    minSelections?: number;
    maxSelections?: number;
}