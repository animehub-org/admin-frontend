import BasePage from "./BasePage.tsx";
import type { BaseProps, PageState } from "../types/PageTypes.ts";
import { Link } from "react-router-dom";
import React from "react";

export type BaseHomeState<T> = PageState & {
    items: T[]
}

export abstract class BaseHomePage<P extends BaseProps, S extends BaseHomeState<T>, T> extends BasePage<P, S> {

    // Abstract methods to be implemented by child classes
    protected abstract getApiUrl(): string;
    protected abstract getPageTitle(): string;
    protected abstract getNewPath(): string;
    protected abstract getNewLabel(): string;
    protected abstract renderItem(item: T): React.ReactNode;

    protected constructor(props: P, initialState: S) {
        super(props, initialState);
    }

    async componentDidMount() {
        super.componentDidMount();
        this.setState({ title: this.getPageTitle() });
        const result = await this.getFromApi<T[]>(this.getApiUrl());
        if (result !== null) {
            this.setState({
                items: result.data.data
            });
        }
    }

    protected renderContent(): React.ReactNode {
        return (
            <div className="main-home">
                <main>
                    <div className={"title"}>
                        <h1>{this.getPageTitle()}</h1>
                        <Link className="new-button" to={this.getNewPath()}>{this.getNewLabel()}</Link>
                    </div>

                    <div className="anime-list">
                        {this.state.items.map((item) => this.renderItem(item))}
                    </div>
                </main>
            </div>
        );
    }
}
