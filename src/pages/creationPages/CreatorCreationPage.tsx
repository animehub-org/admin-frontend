import { BaseCreationPage } from "./BaseCreationPage.tsx";
import type { FormState, FormSchema } from "../../types/FormOption.ts";
import type { BaseProps } from "../../types/PageTypes.ts";

type CreatorData = {
    name: string
}

const CREATOR_FORM_SCHEMA: FormSchema<CreatorData> = {
    name: { label: "Nome", type: "text" },
}

class CreatorCreationPage extends BaseCreationPage<CreatorData, typeof CREATOR_FORM_SCHEMA, BaseProps> {
    protected getResourceName(): string {
        return "creator"
    }

    state: FormState<CreatorData> & { err: any, loading: boolean, title: string } = {
        formData: {
            name: ""
        },
        title: "Novo Criador/Autor",
        err: null,
        loading: false,
    }

    protected getFormSchema(): typeof CREATOR_FORM_SCHEMA {
        return CREATOR_FORM_SCHEMA;
    }
}
export default CreatorCreationPage;
