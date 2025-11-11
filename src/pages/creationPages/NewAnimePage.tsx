import "../../css/newAnimePage.scss"
import {BaseCreationPage} from "./BaseCreationPage.tsx";
import type {FormSchema} from "../../types/FormOption.ts";
import type {BaseProps} from "../../types/PageTypes.ts";

type AnimeData = {
    name: string,
    name2: string,
    description: string,
    releaseDate: Date,
    genre: string[],
    state: string,
    quality: string,
}

const ANIME_FORM_SCHEMA: FormSchema<AnimeData> = {
    name: { label: "Nome", type:"text" },
    name2: { label: "Nome alternativo", type:"text" },
    description: { label: "Descrição", type: "textarea" },
    releaseDate: {label: "Data lançamento", type: "date"},
    genre: {label: "Gêneros", type:"array"},
    state: {label: "Estado", type: "select", options: []},
    quality: {label: "Quantidade", type: "select"},
}

class NewAnimePage extends BaseCreationPage<AnimeData, typeof ANIME_FORM_SCHEMA, BaseProps> {
    state= {
        formData: {
            name: "",
            name2: "",
            description: "",
            releaseDate: new Date(),
            genre: [],
            state: "",
            quality: ""
        },
        arrayOptions: {},
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