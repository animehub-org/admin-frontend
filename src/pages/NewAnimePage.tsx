import BasePage from "./BasePage.tsx";
import type {BaseProps, BaseState} from "../types/PageTypes.ts";
import React from "react";
import "../css/newAnimePage.scss"

type NewAnimePageState = BaseState & {

}

class NewAnimePage extends BasePage<BaseProps, NewAnimePageState>{

    state: NewAnimePageState = {
        err: null,
        loading: false,
        title: "Novo anime"
    };
    protected renderContent(): React.ReactNode {
        return (
            <div className="main-home">
                <main className="main-new">
                    <h1>Novo anime</h1>
                    <div>
                        <label htmlFor={"name"}>Nome: </label>
                        <input id={"name"}/>
                    </div>
                    <div>
                        <label htmlFor={"name2"}>Nome 2: </label>
                        <input id="name2"/>
                    </div>
                    <div>
                        <label>Descrição: </label>
                        <textarea/>
                    </div>
                </main>
            </div>
        )
    }
}

export default NewAnimePage