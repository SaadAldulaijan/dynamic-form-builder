
import { FormSchema } from "../models/form-schema";


// ==================== SAMPLE DATA ====================
export const sampleFormSchema: FormSchema = {
  key: 'sample-request-form',
  titleKey: 'DYNAMIC_FORM.TITLE',
  sections: [
    {
      key: 'personalInfo',
      titleKey: 'DYNAMIC_FORM.SECTIONS.PERSONAL_INFO',
      descriptionKey: 'DYNAMIC_FORM.SECTIONS.PERSONAL_INFO_DESC',
      layout: {
        containerClass: 'card card-body mb-3',
        titleClass: 'h5 mb-2',
        descriptionClass: 'text-muted mb-3',
        fieldsWrapperClass: 'row g-3'
      },
      fields: [
        {
          key: 'name',
          labelKey: 'DYNAMIC_FORM.FIELDS.NAME',
          type: 'text',
          layout: {
            wrapperClass: 'col-md-6'
          },
          validations: {
            required: true,
            maxLength: 50
          },
          messageKeys: {
            required: 'DYNAMIC_FORM.VALIDATION.NAME_REQUIRED'
          }
        },
        {
          key: 'age',
          labelKey: 'DYNAMIC_FORM.FIELDS.AGE',
          type: 'number',
          layout: {
            wrapperClass: 'col-md-6'
          },
          validations: {
            required: true,
            min: 18,
            max: 60
          }
        },
        {
          key: 'gender',
          labelKey: 'DYNAMIC_FORM.FIELDS.GENDER',
          type: 'dropdown',
          options: [
            { labelKey: 'DYNAMIC_FORM.OPTIONS.MALE', value: 'male' },
            { labelKey: 'DYNAMIC_FORM.OPTIONS.FEMALE', value: 'female' }
          ],
          validations: {
            required: true
          }
        },
        {
          key: 'quantity',
          label: 'Quantity',
          type: 'number',
          validations: {
            required: true,
            min: 1
          }
        },
        {
          key: 'unitPrice',
          label: 'Unit Price',
          type: 'number',
          validations: {
            required: true,
            min: 0
          }
        },
        {
          key: 'total',
          label: 'Total',
          type: 'number',
          readonly: true,
          calculatedFrom: {
            fields: ['quantity', 'unitPrice'],
            expression: 'quantity * unitPrice',
            precision: 2
          }
        },
        {
          key: 'pregnancyStatus',
          labelKey: 'DYNAMIC_FORM.FIELDS.PREGNANCY_STATUS',
          type: 'radio',
          options: [
            { labelKey: 'DYNAMIC_FORM.OPTIONS.YES', value: 'true' },
            { labelKey: 'DYNAMIC_FORM.OPTIONS.NO', value: 'false' }
          ],
          visibleWhen: {
            field: 'gender',
            operator: 'equals',
            value: 'female'
          },
          requiredWhen: {
            field: 'gender',
            operator: 'equals',
            value: 'female'
          },
          clearValueWhenHidden: true,
        },
        {
          key: 'address',
          label: 'Address',
          type: 'group',
          layout: {
            wrapperClass: 'col-12',
            containerClass: 'border rounded p-3',
            titleClass: 'float-none w-auto px-2 h6',
            fieldsWrapperClass: 'row g-3'
          },
          fields: [
            {
              key: 'region',
              labelKey: 'DYNAMIC_FORM.FIELDS.REGION',
              type: 'dropdown',
              layout: {
                wrapperClass: 'col-md-6'
              },
              options: [
                { label: 'Riyadh', value: '1' },
                { label: 'Makkah', value: '2' }
              ],
              validations: {
                required: true
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.REGION_REQUIRED'
              }
            },
            {
              key: 'city',
              labelKey: 'DYNAMIC_FORM.FIELDS.CITY',
              type: 'dropdown',
              dependsOn: 'region',
              layout: {
                wrapperClass: 'col-md-6'
              },
              options: [
                { label: 'Riyadh', value: '3', parentValue: '1' },
                { label: 'Al Majmaah', value: '24', parentValue: '1' },
                { label: 'Makkah', value: '10', parentValue: '2' },
                { label: 'Jeddah', value: '11', parentValue: '2' }
              ],
              validations: {
                required: true
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.CITY_REQUIRED'
              }
            },
            {
              key: 'district',
              labelKey: 'DYNAMIC_FORM.FIELDS.DISTRICT',
              type: 'text',
              validations: {
                required: true
              },
              messageKeys: {
                required: 'DYNAMIC_FORM.VALIDATION.DISTRICT_REQUIRED'
              }
            }
          ]
        },
        {
          key: 'requestDate',
          label: 'Request Date',
          type: 'date',
          defaultValue: 'today'
        },
        {
          key: 'supportingAttachment',
          label: 'Supporting Attachment',
          type: 'file',
          validations: {
            required: false,
            maxFileSizeMb: 5,
            allowedExtensions: ['pdf', 'docx']
          },
          messages: {
            required: 'Attachment is required',
            maxFileSize: 'File size must not exceed 5 MB',
            allowedExtensions: 'Only PDF and DOCX files are allowed'
          }
        }
      ]
    },
    {
      key: 'requestInfo',
      title: 'Request Information',
      fields: [
        {
          key: 'services',
          label: 'Requested Services',
          type: 'multiselect',
          options: [
            { label: 'Data Sharing', value: 'dataSharing' },
            { label: 'Dashboard Access', value: 'dashboardAccess' },
            { label: 'API Integration', value: 'apiIntegration' },
            { label: 'Raw Data Export', value: 'rawDataExport' }
          ],
          validations: {
            required: true,
            minSelected: 1,
            maxSelected: 3
          },
          messages: {
            required: 'Please select at least one service',
            minSelected: 'Please select at least one service',
            maxSelected: 'You can select maximum 3 services only'
          }
        },
        {
          key: 'hasPreviousRequest',
          label: 'Do you have a previous request?',
          type: 'radio',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
          ],
          validations: {
            required: true
          },
          messages: {
            required: 'Please select yes or no'
          }
        },
        {
          key: 'previousRequestReason',
          label: 'Previous Request Reason',
          type: 'text',
          requiredWhen: {
            field: 'hasPreviousRequest',
            operator: 'equals',
            value: 'true'
          },
          disabledWhen: {
            field: 'hasPreviousRequest',
            operator: 'equals',
            value: 'false'
          },
          messages: {
            required: 'Previous request reason is required when you select Yes'
          }
        },
        {
          key: 'startDate',
          label: 'Start Date',
          type: 'date',
          validations: {
            required: true,
            minDateToday: true
          },
          messages: {
            required: 'Start date is required',
            minDateToday: 'Start date cannot be in the past'
          }
        },
        {
          key: 'endDate',
          label: 'End Date',
          type: 'date',
          validations: {
            required: true,
            dateGreaterThanOrEqualField: 'startDate'
          },
          messages: {
            required: 'End date is required',
            dateGreaterThanOrEqualField: 'End date must be after or equal to start date'
          }
        },
        {
          key: 'contractDate',
          label: 'Contract Date',
          type: 'date',
          validations: {
            required: true,
            minDate: '2026-01-01',
            maxDate: '2026-12-31'
          },
          messages: {
            required: 'Contract date is required',
            minDate: 'Contract date cannot be before 2026-01-01',
            maxDate: 'Contract date cannot be after 2026-12-31'
          }
        }
      ]
    },
    {
      key: 'projectsInfo',
      title: 'Projects Information',
      description: 'Projects Information',
      fields: [
        {
          key: 'projects',
          labelKey: 'DYNAMIC_FORM.FIELDS.PROJECTS',
          type: 'array',
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
                key: 'projectName',
                labelKey: 'DYNAMIC_FORM.FIELDS.PROJECT_NAME',
                type: 'text',
                layout: {
                  wrapperClass: 'col-md-6'
                },
                validations: {
                  required: true
                }
              },
              {
                key: 'stakeholders',
                labelKey: 'DYNAMIC_FORM.FIELDS.STAKEHOLDERS',
                type: 'array',
                itemSchema: {
                  fields: [
                    {
                      key: 'name',
                      labelKey: 'DYNAMIC_FORM.FIELDS.STAKEHOLDER_NAME',
                      type: 'text',
                      validations: {
                        required: true
                      }
                    },
                    {
                      key: 'email',
                      labelKey: 'DYNAMIC_FORM.FIELDS.STAKEHOLDER_EMAIL',
                      type: 'text',
                      validations: {
                        required: true,
                        email: true,
                      },
                      messages: {
                        required: 'Email is required',
                        email: 'Please enter a valid email address'
                      }
                    },
                    {
                      key: 'phoneNumber',
                      labelKey: 'DYNAMIC_FORM.FIELDS.STAKEHOLDER_PHONE',
                      type: 'text',
                      validations: {
                        required: true,
                        startsWith: '05',
                        exactLength: 10,
                      },
                      messages: {
                        startsWith: 'Phone number must start with 05',
                        exactLength: 'Phone number must be exactly 10 digits'
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
      ]
    }
  ],
};