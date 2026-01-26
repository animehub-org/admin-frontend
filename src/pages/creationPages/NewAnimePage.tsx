import "../../css/newAnimePage.scss"
import { BaseCreationPage } from "./BaseCreationPage.tsx";
import type { FormOption, FormSchema } from "../../types/FormOption.ts";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { BaseFormState } from "../BaseFormPage.tsx";
import type { Genre } from "../../types/Genre.ts";

type AnimeData = {
    name: string,
    name2: string,
    description: string,
    releaseDate: Date,
    genre: string[],
    state: string,
    quality: string,
}

interface NewAnimePageState extends BaseFormState<AnimeData> {
    genreOptions: FormOption[];
}

class NewAnimePage extends BaseCreationPage<AnimeData, FormSchema<AnimeData>, BaseProps, NewAnimePageState> {
    state: NewAnimePageState = {
        formData: {
            name: "",
            name2: "",
            description: "",
            releaseDate: new Date(),
            genre: [],
            state: "",
            quality: ""
        },
        genreOptions: [],
        title: "Novo anime",
        err: null,
        loading: false
    }

    async componentDidMount() {
        super.componentDidMount();
        await this.loadGenres();
    }

    private async loadGenres() {
        try {
            const response = await this.getFromApi<Genre[]>("/g/genre/all");
            if (response?.data.success && response.data.data) {
                const options: FormOption[] = response.data.data.map(genre => ({
                    label: genre.name,
                    value: String(genre.id)
                }));
                this.setState({ genreOptions: options });
            }
        } catch (error) {
            console.error("Erro ao carregar gêneros:", error);
        }
    }

    protected getFormSchema(): FormSchema<AnimeData> {
        return {
            name: { label: "Nome", type: "text" },
            name2: { label: "Nome alternativo", type: "text" },
            description: { label: "Descrição", type: "textarea" },
            releaseDate: { label: "Data lançamento", type: "date" },
            genre: { label: "Gêneros", type: "multiselect", options: this.state.genreOptions },
            state: { label: "Estado", type: "select", options: [] },
            quality: { label: "Qualidade", type: "select", options: [] },
        };
    }

    protected getResourceName(): string {
        return "anime";
    }

    protected async handleCreation() {
        //TODO
    }
}

export default NewAnimePage