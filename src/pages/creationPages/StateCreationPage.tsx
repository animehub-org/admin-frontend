import {BaseCreationPage} from "./BaseCreationPage.tsx";
import type {FormState, FormSchema} from "../../types/FormOption.ts";
import type {BaseProps} from "../../types/PageTypes.ts";

type StateData = {
    name: string
}

const STATE_FORM_SCHEMA: FormSchema<StateData> = {
    name: { label: "Name", type: "text" },
}


class StateCreationPage extends BaseCreationPage<StateData, typeof STATE_FORM_SCHEMA, BaseProps>{
    state: FormState<StateData> = {
        formData: {
            name: ""
        },
        arrayOptions:{},
        title: "Novo estado de lançamento",
        err: null,
        loading: false,
    }
    protected getFormSchema(): typeof STATE_FORM_SCHEMA {
        return STATE_FORM_SCHEMA;
    }
    protected async handleCreation(): Promise<void> {
        //todo
    }
}
export default StateCreationPage