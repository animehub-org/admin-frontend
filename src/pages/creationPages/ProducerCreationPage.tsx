import { BaseCreationPage } from "./BaseCreationPage.tsx";
import type { FormState, FormSchema } from "../../types/FormOption.ts";
import type { BaseProps } from "../../types/PageTypes.ts";

type ProducerData = {
    name: string
}

const PRODUCER_FORM_SCHEMA: FormSchema<ProducerData> = {
    name: { label: "Nome", type: "text" },
}

class ProducerCreationPage extends BaseCreationPage<ProducerData, typeof PRODUCER_FORM_SCHEMA, BaseProps> {
    protected getResourceName(): string {
        return "producer"
    }

    state: FormState<ProducerData> & { err: any, loading: boolean, title: string } = {
        formData: {
            name: ""
        },
        title: "Novo Produtor/Estúdio",
        err: null,
        loading: false,
    }

    protected getFormSchema(): typeof PRODUCER_FORM_SCHEMA {
        return PRODUCER_FORM_SCHEMA;
    }
}
export default ProducerCreationPage;
