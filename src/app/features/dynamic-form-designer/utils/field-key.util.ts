import { FieldSchema, FormSchema } from "../../dynamic-form/models/form-schema";

export function generateUniqueFieldKey(
  schema: FormSchema,
  fieldType: FieldSchema['type'],
): string {
  const existingKeys = getAllFieldKeys(schema);

  let index = 1;
  let candidate = `${fieldType}${index}`;

  while (existingKeys.has(candidate)) {
    index++;
    candidate = `${fieldType}${index}`;
  }

  return candidate;
}

function getAllFieldKeys(schema: FormSchema): Set<string> {
  const keys = new Set<string>();

  if ('fields' in schema) {
    collectFieldKeys(schema.fields!, keys);
  }

  if ('sections' in schema) {
    for (const section of schema.sections!) {
      collectFieldKeys(section.fields, keys);
    }
  }

  return keys;
}

function collectFieldKeys(
  fields: FieldSchema[],
  keys: Set<string>,
): void {
  for (const field of fields) {
    keys.add(field.key);

    if (field.type === 'group') {
      collectFieldKeys(field.fields, keys);
    }

    if (field.type === 'array') {
      collectFieldKeys(field.itemSchema.fields, keys);
    }
  }
}