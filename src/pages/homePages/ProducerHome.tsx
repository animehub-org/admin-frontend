import { BaseHomePage, type BaseHomeState } from "../BaseHomePage.tsx";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { Producer } from "../../types/Producer.ts";
import HomeListComponent from "../../components/HomeListComponent.tsx";
import React from "react";

type ProducerHomeState = BaseHomeState<Producer>;

class ProducerHomePage extends BaseHomePage<BaseProps, ProducerHomeState, Producer> {

    constructor(props: BaseProps) {
        super(props, {
            loading: false,
            err: null,
            title: "Produtores / Estúdios",
            items: []
        });
    }

    protected getApiUrl(): string {
        return "/producer/all";
    }

    protected getPageTitle(): string {
        return "Produtores / Estúdios";
    }

    protected getNewPath(): string {
        return "/producer/new";
    }

    protected getNewLabel(): string {
        return "Novo Produtor";
    }

    protected renderItem(item: Producer): React.ReactNode {
        return <HomeListComponent type={item} key={item.id} />;
    }
}

export default ProducerHomePage;
