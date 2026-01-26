import { BaseHomePage, type BaseHomeState } from "../BaseHomePage.tsx";
import type { BaseProps } from "../../types/PageTypes.ts";
import type { Genre } from "../../types/Genre.ts";
import HomeListComponent from "../../components/HomeListComponent.tsx";
import React from "react";

type GenreHomeState = BaseHomeState<Genre>;

class GenreHomePage extends BaseHomePage<BaseProps, GenreHomeState, Genre> {

    constructor(props: BaseProps) {
        super(props, {
            loading: false,
            err: null,
            title: "Gêneros",
            items: []
        });
    }

    protected getApiUrl(): string {
        return "/g/genre/all";
    }

    protected getPageTitle(): string {
        return "Gêneros";
    }

    protected getNewPath(): string {
        return "/genre/new";
    }

    protected getNewLabel(): string {
        return "Novo Gênero";
    }

    protected renderItem(item: Genre): React.ReactNode {
        return <HomeListComponent type={item} key={item.id} />; // Added key for React list
    }
}

export default GenreHomePage;