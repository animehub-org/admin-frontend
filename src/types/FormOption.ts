import type { BaseState } from "./PageTypes.ts";

export interface FormOption {
    label: string;
    value: string;
}

export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'readonly' | 'multiselect' | 'image';

export interface FormField {
    label: string;
    type: FieldType;
    // path?: GetArrayPath;
    options?: FormOption[];
}

export type FormSchema<T> = {
    [K in keyof T]: FormField | null;
};

export type FormState<T> = BaseState & {
    formData: T;
    // arrayOptions: Record<string, FormOption[]>
};