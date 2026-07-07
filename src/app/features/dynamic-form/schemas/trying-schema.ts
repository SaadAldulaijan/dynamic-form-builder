import { FormSchema } from '../models/form-schema';

export const testFormSchema: FormSchema = {
  key: 'newTakhseesForm',
  titleKey: 'NEW_TAKHSEES_FORM.TITLE',
  sections: [
    {
      key: 'fieldAndSector',
      titleKey: 'NEW_TAKHSEES_FORM.SECTIONS.FIELD_AND_SECTOR',
      layout: {
        containerClass: 'card card-body mb-3',
        titleClass: 'h5 mb-2',
        descriptionClass: 'text-muted mb-3',
        fieldsWrapperClass: 'row g-3',
      },
      fields: [
        {
          key: 'crNumber',
          label: 'CR Number',
          type: 'text',
          layout: {
            wrapperClass: 'col-md-6'
          },
          validations: {
            required: true,
            exactLength: 10
          },
          messages: {
            required: 'CR Number is required',
            exactLength: 'CR Number must be 10 digits'
          },
          actions: [
            {
              key: 'retrieveCrInfo',
              type: 'apiLookup',
              label: 'Retrieve CR Info',
              endpointKey: 'retrieveCrInfo',
              requestMapping: {
                crNumber: 'crNumber'
              },
              targetField: 'crInfo'
            }
          ]
        },
        {
          key: 'crInfo',
          label: 'CR Information',
          type: 'jsonViewer',
          layout: {
            wrapperClass: 'col-12'
          }
        }        
      ],
    },
  ],
};
