import { BaseFormPage, type BaseFormState } from "../BaseFormPage.tsx";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { FormSchema } from "../../types/FormOption.ts";
import { BaseException } from "../../exceptions/BaseException.ts";
import { ErrorCode } from "../../types/ResponseType.ts";

/**
 * Página base para criação de novos registros.
 * @template T  **Entity**: O tipo do objeto que será criado (ex: Category).
 * @template F  **Schema**: A estrutura do formulário (FormSchema<T>).
 * @template P  **Props**: As propriedades do componente (Padrão: BaseProps).
 * @template S  **State**: O estado do componente (Padrão: BaseFormState<T>).
 */
export abstract class BaseCreationPage<
    T extends object,
    F extends FormSchema<T>,
    P extends BaseProps = BaseProps,               // Valor padrão adicionado
    S extends BaseFormState<T> = BaseFormState<T>  // Valor padrão adicionado
> extends BaseFormPage<T, F, P, S> {
    protected abstract getResourceName(): string;

    protected async handleSubmit(): Promise<void> {
        const resource = this.getResourceName();

        try {
            this.setState(prevState => ({ ...prevState, loading: true }));

            const response = await this.postToAdminApi<T, T>(`/${resource}/new`, this.state.formData);

            if(!response){
                throw new BaseException(ErrorCode.UNKNOWN_ERROR);
            }

            if (!response.data.success) {
                // Assuming BaseException constructor takes BaseResponse or similar
                // Adjust if BaseException signature is different in local project
                throw new BaseException(response.data.errorCode, response.data.message);
            }

            alert("Criado com sucesso!");
            // this.navigate("/home"); // BasePage doesn't seemingly have navigate? 
            // Checking BasePage.tsx from previous steps... it does NOT have navigate helper.
            // But it inherits from BaseComponent which inherits from React.Component.
            // Usually we use withRouter or hooks. 
            // The external repo used this.navigate. 
            // In local project, we might need to use window.location or props.history if available.
            // Let's assume window.location for now or props.navigate.
            // Looking at GenreHome, it uses Link.
            // Let's use window.location.href for simplicity in port or assume inherited navigate if it exists (it doesn't appear so).

            // Wait, looking at BaseEditPage external code: this.navigate("/home")
            // BasePage in external repo must have had it.
            // Local BasePage extends BaseComponent.
            // Local BaseComponent:
            // class BaseComponent<P={}, S={}> extends Component<P, S> { ... }

            // I'll use window.location.href for now as a fallback or just basic redirection.
            window.location.href = `/${resource}`;

        } catch (e) {
            this.setState({
                err: e instanceof BaseException ? e : new BaseException(ErrorCode.UNKNOWN_ERROR, "Erro desconhecido")
            });
        } finally {
            this.setState(prevState => ({ ...prevState, loading: false }));
        }
    }
}