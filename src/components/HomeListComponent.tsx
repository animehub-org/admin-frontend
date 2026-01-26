import {BaseComponent} from "../types/BaseComponent.tsx";

type baseNameType = {
    id: string| number;
    name: string
}

type props<T extends baseNameType> = {
    type: T
}

class HomeListComponent<T extends baseNameType> extends BaseComponent<props<T>>{
    render() {
        const {type} = this.props;
        return <div className={"item-list"}>
            <p>Id: {type.id}</p>
            <p>Nome: {type.name}</p>
        </div>;
    }
}
export default HomeListComponent