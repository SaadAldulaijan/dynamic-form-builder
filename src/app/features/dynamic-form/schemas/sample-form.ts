
import { FormSchema } from "../models/form-schema";


// ==================== SAMPLE DATA ====================
export const sampleFormSchema: FormSchema = {
  title: 'Dynamic Request Form',
  sections: [
    {
      key: 'personalInfo',
      title: 'Personal Information',
      description: 'Basic applicant information',
      fields: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          validations: {
            required: true,
            maxLength: 50
          }
        },
        {
          key: 'age',
          label: 'Age',
          type: 'number',
          validations: {
            required: true,
            min: 18,
            max: 60
          }
        },
        {
          key: 'gender',
          label: 'Gender',
          type: 'dropdown',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ],
          validations: {
            required: true
          }
        },
        {
          key: 'pregnancyStatus',
          label: 'Pregnancy Status',
          type: 'radio',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' }
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
          key: 'region',
          label: 'Region',
          type: 'dropdown',
          options: [
            { label: "Riyadh", value: "1" },
            { label: "Makkah", value: "2" },
            { label: "Madinah", value: "3" },
            { label: "Qassim", value: "4" },
          ],
          validations: {
            required: true
          }
        },
        {
          key: 'city',
          label: 'City',
          type: 'dropdown',
          dependsOn: 'region',
          options: [
            { label: "Riyadh", value: "3", parentValue: "1" },
            { label: "Al Majmaah", value: "24", parentValue: "1" },
            { label: "Al Ardhiyah Al Janubiyah", value: "4576", parentValue: "2" },
            { label: "Al Ardhiyat", value: "4577", parentValue: "2" },
            { label: "Al Ardhiyah Al Shimaliyah", value: "4578", parentValue: "2" },
            { label: "Batat", value: "4579", parentValue: "2" },
            { label: "As Saddain", value: "3691", parentValue: "2" },
            { label: "Madinah", value: "14", parentValue: "3" },
            { label: "Dibdibbat Fudala", value: "190", parentValue: "3" },
            { label: "Ardah", value: "76", parentValue: "3" },
            { label: "Al Hamnah", value: "351", parentValue: "3" },
            { label: "Umm Al Ghiran", value: "352", parentValue: "3" },
            { label: "Al Mundassah", value: "353", parentValue: "3" },
            { label: "Buqaya Al Janubiyah", value: "3119", parentValue: "4" },
            { label: "Ar Rufayi Al Najh", value: "3120", parentValue: "4" },
            { label: "Al Nashiriyah", value: "3707", parentValue: "4" },
            { label: "Unayzah", value: "80", parentValue: "4" },

          ],
          validations: {
            required: true
          }
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
          label: 'Projects',
          type: 'array',
          itemSchema: {
            fields: [
              {
                key: 'projectName',
                label: 'Project Name',
                type: 'text',
                validations: {
                  required: true
                }
              },
              {
                key: 'stakeholders',
                label: 'Stakeholders',
                type: 'array',
                itemSchema: {
                  fields: [
                    {
                      key: 'name',
                      label: 'Name',
                      type: 'text',
                      validations: {
                        required: true
                      }
                    },
                    {
                      key: 'email',
                      label: 'Email',
                      type: 'text',
                      validations: {
                        required: true,
                        email: true,
                        //pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{1,3}$'
                      },
                      messages: {
                        required: 'Email is required',
                        email: 'Please enter a valid email address'
                      }
                    },
                    {
                      key: 'phoneNumber',
                      label: 'Phone Number',
                      type: 'text',
                      validations: {
                        required: true,
                        startsWith: '05',
                        exactLength: 10,
                        // pattern: '^05[0-9]{8}$'
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