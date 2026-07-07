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
              responseHandling: {
                // jsonViewerField: 'crInfo',
                disableMappedFields: true,
                mapping: {
                  commercialName: 'commercialName',
                  crStatus: 'status',
                  'address.city': 'address.city',
                  'address.street': 'address.street',
                  'address.buildingNumber': 'address.buildingNumber',
                  'address.postalCode': 'address.postalCode',
                  'address.latitude': 'address.location.latitude',
                  'address.longitude': 'address.location.longitude'
                },
                arrayMapping: {
                  owners: {
                    sourcePath: 'owners',
                    targetField: 'owners'
                  }
                }
              }
            }
          ]
        },
        {
          key: 'commercialName',
          label: 'Commercial Name',
          type: 'text',
          readonly: true,
          layout: {
            wrapperClass: 'col-md-6'
          }
        },
        {
          key: 'crStatus',
          label: 'CR Status',
          type: 'text',
          readonly: true,
          layout: {
            wrapperClass: 'col-md-3'
          }
        },

        {
          key: 'address',
          label: 'Address',
          type: 'group',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3 mb-3',
            fieldsWrapperClass: 'row g-3'
          },
          fields: [
            {
              key: 'city',
              label: 'City',
              type: 'text',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            },
            {
              key: 'street',
              label: 'Street',
              type: 'text',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            },
            {
              key: 'buildingNumber',
              label: 'Building Number',
              type: 'text',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            },
            {
              key: 'postalCode',
              label: 'Postal Code',
              type: 'text',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            },
            {
              key: 'latitude',
              label: 'Latitude',
              type: 'number',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            },
            {
              key: 'longitude',
              label: 'Longitude',
              type: 'number',
              readonly: true,
              layout: {
                wrapperClass: 'col-md-6'
              }
            }
          ]
        },


        {
          key: 'owners',
          label: 'Owners',
          type: 'array',
          readonly: true,
          arrayDisplayMode: 'readonly-list',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3 mb-3'
          },
          itemSchema: {
            fields: [
              {
                key: 'name',
                label: 'Owner Name',
                type: 'text'
              },
              {
                key: 'nationalId',
                label: 'National ID',
                type: 'text'
              },
              {
                key: 'ownershipPercentage',
                label: 'Ownership %',
                type: 'number'
              },
              {
                key: 'ownershipType',
                label: 'Ownership Type',
                type: 'text'
              }
            ]
          }
        },
        // {
        //   key: 'crInfo',
        //   label: 'Raw CR Information',
        //   type: 'jsonViewer',
        //   layout: {
        //     wrapperClass: 'col-12'
        //   }
        // }
      ],
    },
  ],
};
