
export type FieldValue =
    | string
    | number
    | boolean
    | null
    | FieldValue[]
    | { [key: string]: FieldValue };