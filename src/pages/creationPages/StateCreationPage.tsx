import { BaseCreationPage } from "./BaseCreationPage.tsx";
import type { FormState, FormSchema } from "../../types/FormOption.ts";
import type { BaseProps } from "../../types/PageTypes.ts";

// Usa o tipo State da API ou define local se for só para criação
// Se o backend espera apenas { name: string }, está ok.
type StateData = {
    name: string
}

const STATE_FORM_SCHEMA: FormSchema<StateData> = {
    name: { label: "Nome", type: "text" },
}

class StateCreationPage extends BaseCreationPage<StateData, typeof STATE_FORM_SCHEMA, BaseProps> {
    protected getResourceName(): string {
        return "state"
    }

    // Inicializa o estado com valores corretos
    state: FormState<StateData> & { err: any, loading: boolean, title: string } = {
        formData: {
            name: ""
        },
        title: "Novo status de lançamento",
        err: null,
        loading: false,
    }

    protected getFormSchema(): typeof STATE_FORM_SCHEMA {
        return STATE_FORM_SCHEMA;
    }
}
export default StateCreationPage