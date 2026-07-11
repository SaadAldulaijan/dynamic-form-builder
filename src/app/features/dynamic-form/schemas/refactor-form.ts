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
          }
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
        }
      ]
    }
  ],
};
