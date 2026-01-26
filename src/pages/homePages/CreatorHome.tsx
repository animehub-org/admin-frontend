import { BaseHomePage, type BaseHomeState } from "../BaseHomePage.tsx";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { Creator } from "../../types/Creator.ts";
import HomeListComponent from "../../components/HomeListComponent.tsx";
import React from "react";

type CreatorHomeState = BaseHomeState<Creator>;

class CreatorHomePage extends BaseHomePage<BaseProps, CreatorHomeState, Creator> {

    constructor(props: BaseProps) {
        super(props, {
            loading: false,
            err: null,
            title: "Autores (Creators)",
            items: []
        });
    }

    protected getApiUrl(): string {
        return "/creator/all";
    }

    protected getPageTitle(): string {
        return "Autores / Criadores";
    }

    protected getNewPath(): string {
        return "/creator/new";
    }

    protected getNewLabel(): string {
        return "Novo Autor";
    }

    protected renderItem(item: Creator): React.ReactNode {
        return <HomeListComponent type={item} key={item.id} />;
    }
}

export default CreatorHomePage;
