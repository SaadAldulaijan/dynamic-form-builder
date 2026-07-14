import { FormSchema } from '../models/form-schema';



export const formGroupForm: FormSchema = {
  key: 'formGroupForm',
  title: 'Form Group Form',
  sections: [
    {
      key: 'generalInfoSection',
      title: 'General Info',
      fields: [
        {
          key: 'personalInfo',
          label: 'Personal Info',
          type: 'group',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3',
            titleClass: 'float-none w-auto px-2 h6',
            fieldsWrapperClass: 'row g-3',
          },
          fields: [
            {
              key: 'firstName',
              labelKey: 'DYNAMIC_FORM.FIELDS.FIRST_NAME',
              type: 'text',
              layout: {
                wrapperClass: 'col-md-6',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.FIRST_NAME_REQUIRED',
              },
            },
            {
              key: 'lastName',
              labelKey: 'DYNAMIC_FORM.FIELDS.LAST_NAME',
              type: 'text',
              layout: {
                wrapperClass: 'col-md-6',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.LAST_NAME_REQUIRED',
              },
            },
            {
              key: 'dateOfBirth',
              labelKey: 'DYNAMIC_FORM.FIELDS.DATE_OF_BIRTH',
              type: 'date',
              layout: {
                wrapperClass: 'col-md-6',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.DATE_OF_BIRTH_REQUIRED',
              },
            },
            {
              key: 'joinDate',
              labelKey: 'DYNAMIC_FORM.FIELDS.JOIN_DATE',
              type: 'date',
              layout: {
                wrapperClass: 'col-md-6',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.JOIN_DATE_REQUIRED',
              },
            },
          ]
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
        }
      ]
    },
    {
      key: 'requestSection',
      title: 'Request Address',
      fields: [
        {
          key: 'requestBasicInfo',
          label: 'Request Basic Info',
          type: 'group',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3',
            titleClass: 'float-none w-auto px-2 h6',
            fieldsWrapperClass: 'row g-3',
          },
          fields: [
            {
              key: 'requestNumber',
              labelKey: 'DYNAMIC_FORM.FIELDS.REQUEST_NUMBER',
              type: 'text',
              layout: {
                wrapperClass: 'col-md-12',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.REQUEST_NUMBER_REQUIRED',
              },
            },
            {
              key: 'description',
              labelKey: 'DYNAMIC_FORM.FIELDS.DESCRIPTION',
              type: 'textarea',
              layout: {
                wrapperClass: 'col-md-12',
              },
              validations: {
                required: true,
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.DESCRIPTION_REQUIRED',
              },
            },
          ]
        },
      ]
    }
  ]
}



export const arrayForm: FormSchema = {
  key: 'arrayForm',
  title: 'Array Form',
  sections: [

    {
      key: 'arraySection',
      title: 'Array Section',
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
