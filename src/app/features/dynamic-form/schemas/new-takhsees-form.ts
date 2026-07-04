import { FormSchema } from '../models/form-schema';

const FIEDS_OPTIONS = [
  {
    value: 'industrial',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.INDUSTRIAL',
  },
  {
    value: 'utility',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.UTILITY',
  },
  {
    value: 'nonIndustrial',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.NON_INDUSTRIAL',
  },
];

const SECTORS_OPTIONS = [
  {
    value: 'petrochemicalAndRefinaries',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.PETROCHEMICAL_AND_REFINARIES',
    parentValue: 'industrial',
  },
  {
    value: 'miningAndMinerals',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.MINING_AND_MINERALS',
    parentValue: 'industrial',
  },
  {
    value: 'mediumAndLightIndustries',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.MEDIUM_AND_LIGHT_INDUSTRIES',
    parentValue: 'industrial',
  },
  {
    value: 'powerPlants',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.POWER_PLANTS',
    parentValue: 'utility',
  },
  {
    value: 'cogeneration',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.COGENERATION',
    parentValue: 'utility',
  },
  {
    value: 'waterDesalination',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.WATER_DESALINATION',
    parentValue: 'utility',
  },
  {
    value: 'waterTreatment',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.WATER_TREATMENT',
    parentValue: 'utility',
  },
  {
    value: 'powerGeneratingUnits',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.POWER_GENERATION_UNITS',
    parentValue: 'utility',
  },
  {
    value: 'electricityAllocation',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.ELECTRICITY_ALLOCATION',
    parentValue: 'utility',
  },
  {
    value: 'gasStations',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.GAS_STATIONS',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'contracting',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.CONTRACTING',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'quarriesAndMines',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.QUARRIES_AND_MINES',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'transport',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.TRANSPORT',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'laundries',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.LAUNDRIES',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'foodAndBeverages',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.FOOD_AND_BEVERAGES',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'petroleumProductsDistributors',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.PETROLEUM_PRODUCTS_DISTRIBUTORS',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'farmers',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.FARMERS',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'marineServices',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.MARINE_SERVICES',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'flight',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.FLIGHT',
    parentValue: 'nonIndustrial',
  },
  {
    value: 'other',
    labelKey: 'NEW_TAKHSEES_FORM.OPTIONS.OTHER',
    parentValue: 'nonIndustrial',
  },
];

export const newTakhseesFormSchema: FormSchema = {
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
          key: 'field',
          labelKey: 'NEW_TAKHSEES_FORM.FIELDS.FIELD',
          type: 'dropdown',
          options: FIEDS_OPTIONS,
          validations: {
            required: true,
          },
          layout: {
            wrapperClass: 'col-md-6',
          },
        },
        {
          key: 'sector',
          labelKey: 'NEW_TAKHSEES_FORM.FIELDS.SECTOR',
          type: 'dropdown',
          dependsOn: 'field',
          options: SECTORS_OPTIONS,
          validations: {
            required: true,
          },
          layout: {
            wrapperClass: 'col-md-6',
          },
        },
      ],
    },
    {
      key: 'projectDetails',
      titleKey: 'NEW_TAKHSEES_FORM.SECTIONS.GENERAL_PROJECT_INFO',
      fields: [
        {
          key: 'maximumElectricityDemand',
          labelKey: 'NEW_TAKHSEES_FORM.FIELDS.MAXIMUM_ELECTRICITY_DEMAND',
          type: 'number',
          layout: {
            wrapperClass: 'col-md-6',
          },
          validations: {
            required: true,
            min: 1,
            max: 99999999999999,
            allowDecimal: true,
            decimalPrecision: 4,
          },
          display: {
            useThousandsSeparator: true,
            suffixKey: 'NEW_TAKHSEES_FORM.SUFFIX.KW',
            placeholderKey: 'NEW_TAKHSEES_FORM.PLACEHOLDER.MAXIMUM_ELECTRICITY_DEMAND',
          },
          messages: {
            required: 'Maximum electricity demand is required',
            min: 'Minimum value is 1',
            max: 'Maximum value is 99,999,999,999,999',
            decimalPrecision: 'Maximum 4 digits are allowed after the decimal point',
          },
        },
      ],
    },
  ],
};
