export interface BaseFieldDisplaySchema {
    placeholder?: string;
    placeholderKey?: string;
}

export interface NumberFieldDisplaySchema extends BaseFieldDisplaySchema {
    useThousandsSeparator?: boolean;
    prefix?: string;
    prefixKey?: string;
    suffix?: string;
    suffixKey?: string;
}