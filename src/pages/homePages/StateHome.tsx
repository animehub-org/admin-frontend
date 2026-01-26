import { BaseHomePage, type BaseHomeState } from "../BaseHomePage.tsx";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { State } from "../../types/State.ts";
import HomeListComponent from "../../components/HomeListComponent.tsx";
import React from "react";

type StateHomeState = BaseHomeState<State>;

class StateHomePage extends BaseHomePage<BaseProps, StateHomeState, State> {

    constructor(props: BaseProps) {
        super(props, {
            loading: false,
            err: null,
            title: "Status de Lançamento",
            items: []
        });
    }

    protected getApiUrl(): string {
        return "/state/all";
    }

    protected getPageTitle(): string {
        return "Status de Lançamento";
    }

    protected getNewPath(): string {
        return "/state/new";
    }

    protected getNewLabel(): string {
        return "Novo Status";
    }

    protected renderItem(item: State): React.ReactNode {
        return <HomeListComponent type={item} key={item.id} />;
    }
}

export default StateHomePage;
