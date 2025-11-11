import type {FormOption, FormSchema, GetArrayPath} from "../../types/FormOption.ts";
import type {BaseProps} from "../../types/PageTypes.ts";
import BasePage from "../BasePage.tsx";
import React, {type ChangeEvent, type JSX} from "react";
import {typedEntries} from "../../functions/userFunctions.ts";
import type {FormState} from "../../types/FormOption.ts";
import type {Genre} from "../../types/Genre.ts";
import ArrayCreationType from "../../components/ArrayCreationType.tsx";

export abstract class BaseCreationPage<T extends object, F extends FormSchema<T>, P extends BaseProps> extends BasePage<P, FormState<T>> {
    public constructor(props: P, initialState: FormState<T>);
    public constructor(initialState: FormState<T>);
    public constructor(arg1: P | FormState<T>, arg2?: FormState<T>) {
        if (arg2) {
            super(arg1 as P, arg2);
        } else {
            super({} as P, arg1 as FormState<T>);
        }
    }

    private handleChangeArray = (id: string, newValues: string[]) => {
        this.setState(prevState => ({
            ...prevState,
            formData: {
                ...prevState.formData,
                [id]: newValues as never // Use 'as any' para evitar erros de tipagem
            }
        }));
    };

    private handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {id, value} = e.target;
        this.setState(prevState =>({
            ...prevState,
            formData: {
                ...prevState.formData,
                [id]: value
            }
        }))
    }
    private async getAllArray(type: GetArrayPath): Promise<FormOption[]> {
        const response = await this.getFromAdminApi<Genre[]>(`/${type}/all`);
        if (!response || !response.data || !response.data.success) {
            return [];
        }
        return response.data.data.map(r => ({
            label: r.name,
            value: r.id.toString(),
        }));
    }

    private async loadArrayOptions() {
        const schema = this.getFormSchema();
        const arrayFields = typedEntries(schema).filter(([, field]) => field.type === 'array' && field.path);

        const optionsPromises = arrayFields.map(([key, field]) =>
            this.getAllArray(field.path!).then(options => ({ key, options }))
        );

        const loadedOptions = await Promise.all(optionsPromises);

        const newOptions = loadedOptions.reduce((acc, { key, options }) => {
            acc[key as string] = options;
            return acc;
        }, {} as Record<string, FormOption[]>);

        this.setState(prevState => ({
            ...prevState,
            arrayOptions: newOptions
        }));
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadArrayOptions();
    }

    protected renderForm(schema: F): React.ReactNode {
        return typedEntries(schema).map(([key, field]) => {
            const fieldKey = key as keyof T;
            const value = this.state.formData[fieldKey];

            let inputElement: JSX.Element;

            switch (field.type) {
                case 'textarea':
                    inputElement = <textarea id={key as string} value={String(value)} onChange={this.handleChange}/>;
                    break;
                case 'select':
                    inputElement = (
                        <select id={key as string} value={String(value)} onChange={this.handleChange}>
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    );
                    break;
                case 'date':
                    inputElement = <input id={key as string} value={String(value)} type="date" onChange={this.handleChange}/>;
                    break;
                case 'array':
                    inputElement = <ArrayCreationType
                        label={field.label}
                        id={key as string}
                        options={this.state.arrayOptions[key as string] || []}
                        values={value as string[] || []}
                        onChange={(newValues) => this.handleChangeArray(key as string, newValues)}
                    />;
                    break;
                case 'text':
                default:
                    inputElement = <input id={key as string} value={String(value)} onChange={this.handleChange}/>;
                    break;
            }
            return (
                <div className="section" key={key as string}>
                    <label htmlFor={key as string}>{field.label}</label>
                    {inputElement}
                </div>
            )
        });
    }

    protected abstract handleCreation(): Promise<void>;
    protected abstract getFormSchema(): F;

    protected renderContent(): React.ReactNode {
        const schema = this.getFormSchema();
        return (
            <div className="main-home">
                <main className='main-new'>
                    {this.renderForm(schema)}
                    <button
                        onClick={()=> this.handleCreation()}
                    >Salvar</button>
                </main>
            </div>
        )
    }

}