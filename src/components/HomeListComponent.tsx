import {BaseComponent} from "../types/BaseComponent.tsx";

type baseNameType = {
    name: string
}

type props<T extends baseNameType> = {
    type: T
}

class HomeListComponent<T extends baseNameType> extends BaseComponent<props<T>>{
    render() {
        return <div>
            <p></p>
        </div>;
    }
}
export default HomeListComponent