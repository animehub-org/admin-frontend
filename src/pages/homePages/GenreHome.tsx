import BasePage from "../BasePage.tsx";
import type {BaseProps, PageState} from "../../types/PageTypes.ts";
import type {Genre} from "../../types/Genre.ts";
import HomeListComponent from "../../components/HomeListComponent.tsx";
import {Link} from "react-router-dom";

type GenreHomeState = PageState & {
    genres: Genre[]
}

class GenreHomePage extends BasePage<BaseProps, GenreHomeState>{

    state: GenreHomeState = {
        loading: false,
        err: null,
        title:"Gêneros",
        genres: [],
    };

    async componentDidMount() {
        super.componentDidMount();
        const result = await this.getFromApi<Genre[]>("/g/genre/all")
        if(result !== null){
            this.setState({
                genres: result.data.data
            })
        }
    }

    protected renderContent(): React.ReactNode {
        return (<div className="main-home">
            <main>
                <div className={"title"}>
                    <h1>Gêneros</h1>
                    <Link className="new-button" to="/genre/new">Novo Gênero</Link>
                </div>

                <div className="anime-list">
                    {this.state.genres.map((genre: Genre) => (
                        <HomeListComponent type={genre}/>
                    ))}
                </div>
            </main>
        </div>)
    }

}

export default GenreHomePage;