# Dynamic Form Builder Roadmap

## Current Features

### ✅ Dynamic Fields

Supported field types:

- Text
- Number
- Checkbox
- Radio Button
- Dropdown
- Cascaded Dropdown
- Array (Repeating Groups)

---

### ✅ Validation Engine

Supported validations:

- Required
- Min Length
- Max Length
- Min Value
- Max Value
- Regex Pattern
- Email Validation
- Custom Validators

Example:

```ts
validations: {
  required: true,
  minLength: 5,
  maxLength: 50
}
```

---

### ✅ Custom Validation Messages

Example:

```ts
messages: {
  required: 'Email is required',
  email: 'Email format is not correct'
}
```

Benefits:

- User-friendly messages
- Localization support
- Easier maintenance

---

### ✅ Conditional Visibility

Example:

```ts
visibleWhen: {
  field: 'gender',
  operator: 'equals',
  value: 'female'
}
```

Supported operators:

- equals
- notEquals

---

### ✅ Cascaded Dropdowns

Example:

```text
Region
├── Riyadh
│   ├── Riyadh
│   ├── AlKharj
│   └── Aldwadmi
│
└── Eastern Region
    ├── Dammam
    ├── Khobar
    └── Jubail
```

Example:

```ts
dependsOn: 'region'
```

---

### ✅ Dynamic Arrays

Example:

```text
Projects
├── Project 1
│   ├── Stakeholder 1
│   ├── Stakeholder 2
│
└── Project 2
    ├── Stakeholder 1
    ├── Stakeholder 2
    └── Stakeholder 3
```

Implemented using Angular FormArray.

---

# Next Features

## 1. Conditional Required Validation

Example:

```ts
requiredWhen: {
  field: 'hasPreviousRequest',
  operator: 'equals',
  value: true
}
```

Use Cases:

- Attachments
- Justifications
- Additional Information

Priority: 🔥 High

---

## 2. Disable / Readonly Rules

Example:

```ts
disabledWhen: {
  field: 'requestType',
  operator: 'equals',
  value: 'readonly'
}
```

Use Cases:

- Workflow forms
- Approval forms

Priority: 🔥 High

---

## 3. Clear Hidden Values

Example:

```ts
clearValueWhenHidden: true
```

Purpose:

Prevent hidden fields from being submitted accidentally.

Priority: 🔥 High

---

## 4. Sections

Example:

```ts
sections: [
  {
    title: 'Personal Information',
    fields: []
  },
  {
    title: 'Projects',
    fields: []
  }
]
```

Benefits:

- Better user experience
- Easier maintenance

Priority: 🔥 High

---

## 5. Multi-Select Dropdown

Example:

```ts
{
  key: 'services',
  type: 'multiselect'
}
```

Additional validations:

```ts
validations: {
  minSelected: 1,
  maxSelected: 3
}
```

Priority: 🔥 High

---

## 6. File Upload

Example:

```ts
{
  key: 'attachment',
  type: 'file'
}
```

Validations:

```ts
validations: {
  required: true,
  maxFileSizeMb: 10,
  allowedExtensions: ['pdf', 'docx']
}
```

Priority: 🔥 High

---

## 7. Date Picker

Example:

```ts
{
  key: 'startDate',
  type: 'date'
}
```

Priority: Medium

---

## 8. Date Range Validation

Example:

```ts
validations: {
  greaterThanField: 'startDate'
}
```

Use Cases:

- Project dates
- Contract periods
- Validity periods

Priority: 🔥 High

---

## 9. Array Limits

Example:

```ts
{
  key: 'projects',
  type: 'array',
  minItems: 1,
  maxItems: 5
}
```

Priority: 🔥 High

---

## 10. Field Groups

Example:

```ts
{
  key: 'address',
  type: 'group',
  fields: [
    {
      key: 'city',
      type: 'dropdown'
    },
    {
      key: 'district',
      type: 'text'
    }
  ]
}
```

Benefits:

- Better organization
- Nested object generation

Priority: Medium

---

## 11. Reusable Subforms

Example:

```ts
itemSchemaRef: 'stakeholder'
```

Benefits:

- Avoid duplication
- Easier maintenance

Priority: Medium

---

## 12. Default Values

Example:

```ts
defaultValue: 'sa'
```

Priority: Medium

---

## 13. Calculated Fields

Example:

```ts
{
  key: 'total',
  readonly: true,
  calculatedFrom: {
    expression: 'quantity * price'
  }
}
```

Use Cases:

- Totals
- Scores
- Percentages

Priority: Medium

---

## 14. Async Dropdowns

Example:

```ts
optionsSource: {
  type: 'api',
  url: '/api/lookups/regions'
}
```

Benefits:

- No hardcoded data
- Backend-driven lookups

Priority: 🔥 High

---

## 15. Async Validation

Example:

```ts
validations: {
  uniqueFromApi: '/api/users/check-email'
}
```

Use Cases:

- Email uniqueness
- National ID uniqueness
- CR Number uniqueness

Priority: Medium

---

## 16. Save Draft

Features:

- Manual Save
- Auto Save
- Resume Later

Priority: 🔥 High

---

## 17. Form Versioning

Example:

```text
Form V1
Form V2
Form V3
```

Benefits:

- Backward compatibility
- Historical submissions remain valid

Priority: 🔥 High

---

## 18. Localization

Example:

```ts
label: {
  en: 'City',
  ar: 'المدينة'
}
```

Also support localized validation messages.

Priority: 🔥 High

---

## 19. Layout Metadata

Example:

```ts
layout: {
  colSpan: 6,
  order: 1
}
```

Benefits:

- Dynamic Bootstrap / PrimeNG layouts
- Control field ordering from schema

Priority: Medium

---

## 20. Audit Trail

Track:

- Created By
- Updated By
- Submission Time
- Value Changes
- Workflow Actions

Priority: Medium

---

# Suggested Implementation Order

## Phase 1 - Core Runtime

1. Sections
2. Conditional Required
3. Disable / Readonly Rules
4. Clear Hidden Values
5. Array Limits

---

## Phase 2 - Enterprise Features

6. Multi-Select Dropdown
7. File Upload
8. Date Range Validation
9. Async Dropdowns
10. Save Draft

---

## Phase 3 - Advanced Features

11. Reusable Subforms
12. Calculated Fields
13. Async Validation
14. Localization
15. Layout Metadata

---

## Phase 4 - Production Ready

16. Form Versioning
17. Audit Trail
18. Form Builder Admin UI
19. Workflow Integration
20. Reporting & Analytics

---

# Long-Term Architecture

```text
Backend stores form schema JSON
                │
                ▼
Angular renders form dynamically
                │
                ▼
User submits JSON data
                │
                ▼
Backend validates schema
                │
                ▼
Workflow processes submission
                │
                ▼
Versioned and auditable records
```

## Goal

Build a fully metadata-driven enterprise form platform that supports:

- Dynamic forms
- Complex validations
- Conditional business rules
- Workflow integration
- Form versioning
- Auditing
- Localization

Without requiring Angular code changes for every new form.