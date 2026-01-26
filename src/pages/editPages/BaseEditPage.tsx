import { type BaseProps } from "../../types/PageTypes.ts";
import type { FormSchema } from "../../types/FormOption.ts";
import { BaseFormPage, type BaseFormState } from "../BaseFormPage.tsx";
import { BaseException } from "../../exceptions/BaseException.ts";
import { ErrorCode } from "../../types/ResponseType.ts";
import * as React from "react";
// Assuming FontAwesome is installed as per external repo dependencies.
// If not, this might break. Local project seems to use FontAwesome in other places?
// I see imports in external repo: @fortawesome/react-fontawesome, @fortawesome/free-solid-svg-icons
// I'll assume they are available.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface EditPageProps extends BaseProps {
    params: { id: string };
}

/**
 * Página base para edição de registros existentes.
 * @template T  **Entity**: O tipo do objeto que está sendo editado (ex: Category).
 * @template F  **Schema**: A estrutura do formulário (FormSchema<T>).
 * @template P  **Props**: As propriedades do componente (Padrão: EditPageProps).
 * @template S  **State**: O estado do componente (Padrão: BaseFormState<T>).
 */
export abstract class BaseEditPage<
    T extends object,
    F extends FormSchema<T>,
    P extends EditPageProps = EditPageProps,       // Valor padrão adicionado
    S extends BaseFormState<T> = BaseFormState<T>  // Valor padrão adicionado
> extends BaseFormPage<T, F, P, S> {

    constructor(props: P, state: S) {
        super(props, state);
    }

    protected abstract getResourceName(): string;

    // No Edit, geralmente queremos buscar os dados assim que a tela abre
    async componentDidMount() {
        super.componentDidMount(); // Chama o do BasePage se tiver lógica lá
        await this.fetchDataToEdit();
    }

    protected async fetchDataToEdit(): Promise<void> {
        const resource = this.getResourceName();
        // In local project BaseProps has params?: object. 
        // We defined EditPageProps with params: { id: string }.
        // Need to ensure the router passes these params.
        const id = this.props.params?.id;

        if (!id) {
            console.error("ID não encontrado na URL");
            return;
        }

        try {
            this.setState(prevState => ({ ...prevState, loading: true }));
            const response = await this.getFromAdminApi<T>(`/${resource}/${id}`);

            // Checking if response is valid - BasePage usually checks this but lets be safe
            if (response) {
                this.setState(prevState => ({
                    ...prevState,
                    formData: response.data.data,
                    loading: false
                }));
            } else {
                this.setState(prevState => ({ ...prevState, loading: false }));
            }

        } catch (e) {
            this.setState({
                err: e instanceof BaseException ? e : new BaseException(ErrorCode.UNKNOWN_ERROR, "Erro ao carregar dados")
            });
            this.setState(prevState => ({ ...prevState, loading: false }));
        }
    }

    canDelete(): boolean {
        return true;
    }

    protected headerActions(): React.ReactNode {
        if (!this.canDelete()) {
            return null;
        }
        return (
            <button
                className="btn remove"
                onClick={() => this.handleDelete()}
            >
                <FontAwesomeIcon icon={faTrash} /> Deletar
            </button>
        )
    }

    protected async handleDelete(): Promise<void> {
        const resource = this.getResourceName();
        const id = this.props.params?.id;

        if (!id) return;

        if (!confirm("Tem certeza que deseja deletar este item?")) return;

        try {
            this.setState(prevState => ({ ...prevState, loading: true }));
            const response = await this.postToAdminApi<null, null>(`/${resource}/${id}/delete`, null)

            if (!response || !response.data || !response.data.success) {
                throw new BaseException(response?.data?.errorCode || ErrorCode.UNKNOWN_ERROR, response?.data?.message || "Erro desconhecido");
            }
            alert("Deletado com sucesso!")
            window.location.href = `/${resource}`;
        } catch (e) {
            this.setState({
                err: e instanceof BaseException ? e : new BaseException(ErrorCode.UNKNOWN_ERROR, "Erro ao deletar")
            });
        } finally {
            this.setState(prevState => ({ ...prevState, loading: false }));

        }
    }

    protected async handleSubmit(): Promise<void> {
        const resource = this.getResourceName();
        const id = this.props.params?.id;

        if (!id) return;

        try {
            this.setState(prevState => ({ ...prevState, loading: true }));
            // Chama a API: PUT /event/123 (Using postToApi as per BasePage pattern usually)
            // Assuming update endpoint is /resource/id/update or just /resource/update
            // External repo used: /${resource}/${id}/update
            const response = await this.postToAdminApi<T, T>(`/${resource}/${id}/update`, this.state.formData);
            if (!response || !response.data || !response.data.success) {
                throw new BaseException(response?.data?.errorCode || ErrorCode.UNKNOWN_ERROR, response?.data?.message || "Erro desconhecido");
            }
            alert("Atualizado com sucesso!");
            window.location.href = `/${resource}`;
        } catch (e) {
            this.setState({
                err: e instanceof BaseException ? e : new BaseException(ErrorCode.UNKNOWN_ERROR, "Erro ao atualizar")
            });
            this.setState(prevState => ({ ...prevState, loading: false }));
        }
    }
}
