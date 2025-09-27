import type {FormSchema} from "../types/FormOption.ts";
import type {BaseProps, PageState} from "../types/PageTypes.ts";
import BasePage from "./BasePage.tsx";
import React, {type ChangeEvent} from "react";
import {typedEntries} from "../functions/userFunctions.ts";

export abstract class BaseCreationPage<T extends object, F extends FormSchema<T>, P extends BaseProps> extends BasePage<P, PageState & {formData : T}> {
    protected constructor(initialState: PageState & {formData : T}) {
        super(initialState);
    }

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

    protected renderForm(schema: F): React.ReactNode {
        return typedEntries(schema).map(([key, field]) => {
            const fieldKey = key as keyof T;
            const value = this.state.formData[fieldKey];

            let inputElement;
            switch (field.type) {
                case 'textarea':
                    inputElement = <textarea
                        id={key as string}
                        value={value as any}
                        onChange={this.handleChange}
                    />;
                    break;
                case 'select':
                    inputElement = (
                        <select
                            id={key as string}
                            value={value as any}
                            onChange={this.handleChange}
                        >
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    )
                    break;
                case 'text':
                case 'date':
                default:
                    inputElement = <input id={key as string} value={value as any} onChange={this.handleChange} />
                    break;
            }
            return (
                <div key={key as string}>
                    <label htmlFor={key as string}>{field.label}</label>
                    {inputElement}
                </div>
            )
        })
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