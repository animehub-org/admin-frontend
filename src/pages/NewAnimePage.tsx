import "../css/newAnimePage.scss"
import {BaseCreationPage} from "./BaseCreationPage.tsx";
import type {FormSchema} from "../types/FormOption.ts";
import type {BaseProps, PageState} from "../types/PageTypes.ts";

type AnimeData = {
    name: string,
    name2: string,
    description: string,
}

const ANIME_FORM_SCHEMA: FormSchema<AnimeData> = {
    name: { label: "Nome", type:"text" },
    name2: { label: "Nome alternativo", type:"text" },
    description: { label: "Descrição", type: "textarea" },
}

type NewAnimePageState = PageState & {
    formData: AnimeData;
};

class NewAnimePage extends BaseCreationPage<AnimeData, typeof ANIME_FORM_SCHEMA, BaseProps> {
    state: NewAnimePageState = {
        formData: {
            name: "",
            name2: "",
            description: ""
        },
        title: "Novo anime",
        err: null,
        loading: false
    }
    protected getFormSchema(): typeof ANIME_FORM_SCHEMA {
        return ANIME_FORM_SCHEMA;
    }

    protected async handleCreation() {
        //TODO
    }
}

export default NewAnimePage