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
          type:'text',
          visibleWhen: {
            field: 'region',
            operator: 'equals',
            value: '1',
          },
          requiredWhen: {
            field: 'region',
            operator: 'equals',
            value: '1',
          },
          clearValueWhenHidden: true,
        }
      ],
    },
  ],
};
