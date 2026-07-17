import type { FieldDefinition } from "../models/field-definition";

export const FIELD_DEFINITIONS: readonly FieldDefinition[] = [
    {
        type: 'text',
        label: 'Text',
        description: 'Single-line text input',
        category: 'basic',
        iconClass: 'bi bi-input-cursor-text',
        createDefault: () => ({
            key: '',
            label: 'Text Field',
            type: 'text',
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'textarea',
        label: 'Textarea',
        description: 'Multi-line text input',
        category: 'basic',
        iconClass: 'bi bi-textarea-t',
        createDefault: () => ({
            key: '',
            label: 'Textarea Field',
            type: 'textarea',
            rows: 4,
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'number',
        label: 'Number',
        description: 'Numeric input',
        category: 'basic',
        iconClass: 'bi bi-123',
        createDefault: () => ({
            key: '',
            label: 'Number Field',
            type: 'number',
            validations: {
                required: false,
                allowDecimal: false,
            },
        }),
    },
    {
        type: 'checkbox',
        label: 'Checkbox',
        description: 'Boolean checkbox input',
        category: 'basic',
        iconClass: 'bi bi-check-square',
        createDefault: () => ({
            key: '',
            label: 'Checkbox Field',
            type: 'checkbox',
            defaultValue: false,
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'date',
        label: 'Date',
        description: 'Date picker input',
        category: 'basic',
        iconClass: 'bi bi-calendar3',
        createDefault: () => ({
            key: '',
            label: 'Date Field',
            type: 'date',
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'file',
        label: 'File',
        description: 'File upload input',
        category: 'basic',
        iconClass: 'bi bi-paperclip',
        createDefault: () => ({
            key: '',
            label: 'File Field',
            type: 'file',
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'dropdown',
        label: 'Dropdown',
        description: 'Single-select dropdown',
        category: 'selection',
        iconClass: 'bi bi-menu-button-wide',
        createDefault: () => ({
            key: '',
            label: 'Dropdown Field',
            type: 'dropdown',
            options: [],
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'radio',
        label: 'Radio',
        description: 'Single-select radio options',
        category: 'selection',
        iconClass: 'bi bi-ui-radios',
        createDefault: () => ({
            key: '',
            label: 'Radio Field',
            type: 'radio',
            options: [],
            validations: {
                required: false,
            },
        }),
    },
    {
        type: 'multiselect',
        label: 'Multiselect',
        description: 'Multiple-selection input',
        category: 'selection',
        iconClass: 'bi bi-ui-checks',
        createDefault: () => ({
            key: '',
            label: 'Multiselect Field',
            type: 'multiselect',
            options: [],
            validations: {
                required: false,
            },
        }),
    },
];