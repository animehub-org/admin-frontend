import {BaseComponent} from "../types/BaseComponent.tsx";
import type {FormOption} from "../types/FormOption.ts";
interface props {
    value: FormOption;
    onDelete?: (value: string) => void;
}
export class SelectedOptionComponent extends BaseComponent<props>{
    render() {
        const onDelete = this.props.onDelete;
        const {value, label} = this.props.value;
        return <div className="item" key={value}>
            {label}
            <button onClick={onDelete}></button>
        </div>;
    }
}