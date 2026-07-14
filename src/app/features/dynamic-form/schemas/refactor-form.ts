import { FormSchema } from '../models/form-schema';

export const refactorForm: FormSchema = {
  key: 'refactorForm',
  title: 'Refactor Form',
  sections: [
    {
      key: 'section1',
      title: 'Section 1',
      fields: [
        {
          key: 'services',
          label: 'Requested Services',
          type: 'multiselect',
          options: [
            { label: 'Data Sharing', value: 'dataSharing' },
            { label: 'Dashboard Access', value: 'dashboardAccess' },
            { label: 'API Integration', value: 'apiIntegration' },
            { label: 'Raw Data Export', value: 'rawDataExport' },
          ],
          validations: {
            required: true,
            minSelected: 1,
            maxSelected: 3,
          },
          messages: {
            required: 'Please select at least one service',
            minSelected: 'Please select at least one service',
            maxSelected: 'You can select maximum 3 services only',
          },
        },
        {
          key: 'discountType',
          labelKey: 'DYNAMIC_FORM.FIELDS.DISCOUNT_TYPE',
          type: 'checkbox',
          disabledWhen: {
            field: 'discount',
            operator: 'equals',
            value: true,
          },
        },
        {
          key: 'discount',
          labelKey: 'DYNAMIC_FORM.FIELDS.DISCOUNT',
          type: 'checkbox',
          disabledWhen: {
            field: 'discountType',
            operator: 'equals',
            value: true,
          },
        },
        {
          key: 'quantity',
          label: 'Quantity',
          type: 'number',
          validations: {
            required: true,
            min: 1,
          },
        },
        {
          key: 'unitPrice',
          label: 'Unit Price',
          type: 'number',
          validations: {
            required: true,
            min: 0,
            allowDecimal: true,
            decimalPrecision: 4,
          },
          display: {
            useThousandsSeparator: true,
            suffixKey: 'SAR',
          },
        },
        {
          key: 'total',
          label: 'Total',
          type: 'number',
          readonly: true,
          calculatedFrom: {
            fields: ['quantity', 'unitPrice'],
            expression: 'quantity * unitPrice',
            precision: 2,
          },
          display: {
            useThousandsSeparator: true,
            suffixKey: 'SAR',
          },
        },
        {
          key: 'pregnancyStatus',
          labelKey: 'DYNAMIC_FORM.FIELDS.PREGNANCY_STATUS',
          type: 'radio',
          options: [
            { labelKey: 'DYNAMIC_FORM.OPTIONS.YES', value: 'true' },
            { labelKey: 'DYNAMIC_FORM.OPTIONS.NO', value: 'false' },
          ],
          visibleWhen: {
            field: 'total',
            operator: 'equals',
            value: 1000,
          },
          requiredWhen: {
            field: 'total',
            operator: 'equals',
            value: 1000,
          },
          // disabledWhen: {
          //   field: 'total',
          //   operator: 'equals',
          //   value: 1000,
          // },
          clearValueWhenHidden: true,
        },
      ],
    },
    {
      key: 'section2',
      title: 'Section 2',
      fields: [
        {
          key: 'name',
          type: 'text',
          label: 'Name',
          validations: {
            required: true,
          },
        },
        {
          key: 'address',
          label: 'Address',
          type: 'group',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3',
            titleClass: 'float-none w-auto px-2 h6',
            fieldsWrapperClass: 'row g-3',
          },
          fields: [
            {
              key: 'region',
              labelKey: 'DYNAMIC_FORM.FIELDS.REGION',
              type: 'dropdown',
              layout: {
                wrapperClass: 'col-md-6',
              },
              options: [
                { label: 'Riyadh', value: '1' },
                { label: 'Makkah', value: '2' },
              ],
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.REGION_REQUIRED',
              },
            },
            {
              key: 'city',
              labelKey: 'DYNAMIC_FORM.FIELDS.CITY',
              type: 'dropdown',
              dependsOn: 'region',
              layout: {
                wrapperClass: 'col-md-6',
              },
              options: [
                { label: 'Riyadh', value: '3', parentValue: '1' },
                { label: 'Al Majmaah', value: '24', parentValue: '1' },
                { label: 'Makkah', value: '10', parentValue: '2' },
                { label: 'Jeddah', value: '11', parentValue: '2' },
              ],
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.CITY_REQUIRED',
              },
            },
            {
              key: 'district',
              labelKey: 'DYNAMIC_FORM.FIELDS.DISTRICT',
              type: 'text',
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.DISTRICT_REQUIRED',
              },
            },
          ],
        },
        {
          key: 'startDate',
          label: 'Start Date',
          type: 'date',
          validations: {
            required: true,
            minDateToday: true,
          },
          messages: {
            required: 'Start date is required',
            minDateToday: 'Start date cannot be in the past',
          },
        },
        {
          key: 'endDate',
          label: 'End Date',
          type: 'date',
          validations: {
            required: true,
            dateGreaterThanOrEqualField: 'startDate',
          },
          messages: {
            required: 'End date is required',
            dateGreaterThanOrEqualField: 'End date must be after or equal to start date',
          },
        },
        {
          key: 'contractDate',
          label: 'Contract Date',
          type: 'date',
          validations: {
            required: true,
            minDate: '2026-01-01',
            maxDate: '2026-12-31',
          },
          messages: {
            required: 'Contract date is required',
            minDate: 'Contract date cannot be before 2026-01-01',
            maxDate: 'Contract date cannot be after 2026-12-31',
          },
        },
        {
          key: 'supportingAttachment',
          label: 'Supporting Attachment',
          type: 'file',
          validations: {
            required: false,
            maxFileSizeMb: 5,
            allowedExtensions: ['pdf', 'docx'],
          },
          messages: {
            required: 'Attachment is required',
            maxFileSize: 'File size must not exceed 5 MB',
            allowedExtensions: 'Only PDF and DOCX files are allowed',
          },
        },
      ],
    },
    {
      key: 'section3',
      title: 'Section 3',
      fields: [
        {
          key: 'projectOwners',
          labelKey: 'NEW_TAKHSEES_FORM.FIELDS.PROJECT_OWNERS',
          type: 'array',
          arrayDisplayMode: 'modal-list',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3',
            titleClass: 'float-none w-auto px-2 h6',
            actionsClass: 'mb-3',
            itemClass: 'border rounded p-3 mb-3 bg-light',
            fieldsWrapperClass: 'row g-3'
          },
          itemSchema: {
            fields: [
              {
                key: 'name',
                labelKey: 'NEW_TAKHSEES_FORM.FIELDS.OWNER_NAME',
                type: 'text',
                validations: {
                  required: true,
                  maxLength: 200
                }
              },
              {
                key: 'legalStatus',
                labelKey: 'NEW_TAKHSEES_FORM.FIELDS.OWNER_LEGAL_STATUS',
                type: 'dropdown',
                options: [
                  { value: 'commercialEntity', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.COMMERCIAL_ENTITY' },
                  { value: 'militaryEntity', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.MILITARY_ENTITY' },
                  { value: 'civilEntity', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.CIVIL_ENTITY' },
                  { value: 'foreignEntity', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.FOREIGN_ENTITY' },
                ],
                validations: {
                  required: true,
                },
              },
              {
                key: 'ownershipPercentage',
                labelKey: 'NEW_TAKHSEES_FORM.FIELDS.OWNER_PERCENTAGE',
                type: 'number',
                validations: {
                  required: true,
                  min: 5,
                  max: 100,
                  allowDecimal: true,
                  decimalPrecision: 4,
                },
                display: {
                  useThousandsSeparator: false,
                  suffixKey: '%',
                  placeholderKey: '15',
                },
                messages: {
                  required: 'Maximum electricity demand is required',
                  min: 'Minimum value is 5',
                  max: 'Maximum value is 100',
                  decimalPrecision: 'Maximum 4 digits are allowed after the decimal point',
                },
              },
              {
                key: 'entityUnifiedNumber',
                labelKey: 'NEW_TAKHSEES_FORM.FIELDS.OWNER_ENTITY_UNIFIED_NUMBER',
                type: 'text',
                validations: {
                  minLength: 10,
                  maxLength: 10,
                  pattern: '^[0-9]*$',
                },
                visibleWhen: {
                  field: 'legalStatus',
                  operator: 'in',
                  value: ['militaryEntity', 'civilEntity']
                },
                requiredWhen: {
                  field: 'legalStatus',
                  operator: 'in',
                  value: ['militaryEntity', 'civilEntity']
                },
                clearValueWhenHidden: true,
              },
              {
                key: 'nationality',
                labelKey: 'NEW_TAKHSEES_FORM.FIELDS.OWNER_NATIONALITY',
                type: 'dropdown',
                options: [
                  { value: 'china', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.CHINA' },
                  { value: 'india', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.INDIA' },
                  { value: 'usa', labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.USA' },
                ],
                visibleWhen: {
                  field: 'legalStatus',
                  operator: 'equals',
                  value: 'foreignEntity'
                },
                requiredWhen: {
                  field: 'legalStatus',
                  operator: 'equals',
                  value: 'foreignEntity'
                },
                clearValueWhenHidden: true,
              }
            ]
          }
        }
      ],
    },
  ],
};
