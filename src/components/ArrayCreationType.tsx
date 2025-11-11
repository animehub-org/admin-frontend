import {BaseComponent} from "../types/BaseComponent.tsx";
import type {FormOption} from "../types/FormOption.ts";
import type {BaseState} from "../types/PageTypes.ts";
import type {ChangeEvent} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {SelectedOptionComponent} from "./SelectedOptionComponent.tsx";

type props = {
    label: string,
    id: string,
    options: FormOption[],
    values: string[],
    onChange: (values: string[]) => void,
}
type state = BaseState & {
    selectedOption: string;
}

class ArrayCreationType extends BaseComponent<props, state> {

    state: state = {
        err: null,
        loading: false,
        selectedOption: this.props.options.length >0 ? this.props.options[0].value : '',
    }

    private handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        this.setState({ selectedOption: e.target.value });
    };

    private handleAddItem = () =>{
        const { selectedOption } = this.state;
        const {values, onChange} = this.props;
        if(selectedOption.length && !values.indexOf(selectedOption)){
            const newValues = [...values, selectedOption];
            onChange(newValues);
        }
    }

    private handleRemoveItem = (remove: string) =>{
        const {values, onChange} = this.props;
        const newValues = values.filter(value => value !== remove);
        onChange(newValues);
    }

    render() {
        const selectedOptions = this.props.values.map(val =>
            this.props.options.find(opt => opt.value === val)
        ).filter(Boolean) as FormOption[];
        return <div className="array-creation">
            <div>
                <select id={this.props.id} onChange={this.handleSelectChange} value={this.state.selectedOption}>
                    {this.props.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <button onClick={this.handleAddItem}>Adicionar <FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="selected-itens">
                {selectedOptions.map(r=>(
                    <SelectedOptionComponent
                        value={r}
                        onDelete={this.handleRemoveItem}
                    />
                ))}
            </div>
        </div>;
    }
}
export default ArrayCreationType;