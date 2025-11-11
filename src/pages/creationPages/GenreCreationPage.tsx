import {BaseCreationPage} from "./BaseCreationPage.tsx";
import type {FormSchema} from "../../types/FormOption.ts";
import type {BaseProps, CreationPageState} from "../../types/PageTypes.ts";
import type {Genre} from "../../types/Genre.ts";

type GenreData = {
    name: string
}

const GENRE_FORM_SCHEMA: FormSchema<GenreData> = {
    name: {label: "Nome", type: "text"}
}

class GenreCreationPage extends BaseCreationPage<GenreData, typeof GENRE_FORM_SCHEMA, BaseProps>{
    state: CreationPageState<GenreData> = {
        err: null,
        loading: false,
        title: "Novo gênero",
        formData: {
            name: ""
        },
        arrayOptions: {}
    }
    protected async handleCreation(): Promise<void>{
        const response = await this.postToAdminApi<Genre, string>("/genre/new", this.state.formData.name)
        if(response && response.data.success){
            window.location.href = "/genre";
        }
    }
    protected getFormSchema(): FormSchema<GenreData> {
        return GENRE_FORM_SCHEMA;
    }


}
export default GenreCreationPage;