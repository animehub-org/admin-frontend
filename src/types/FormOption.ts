export interface FormOption {
    label: string;
    value: string;
}

export type FieldType = 'text' | 'textarea' | 'date' | 'select';

export interface FormField {
    label: string;
    type: FieldType;
    options?: FormOption[];
}

export type FormSchema<T> = {
    [K in keyof T]: FormField;
};