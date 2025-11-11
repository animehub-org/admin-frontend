import BasePage from "./BasePage.tsx";
import "../css/homePage.scss"
import type {BaseProps, PageState} from "../types/PageTypes.ts";
import type {AnimeSummary} from "../types/Anime.ts";
import AnimeHomeList from "../components/AnimeHomeList.tsx";
import {Link} from "react-router-dom";

type HomePageState = PageState & {
    animes: AnimeSummary[]
};

class Home extends BasePage<BaseProps, HomePageState>{

    state: HomePageState = {
        err: null,
        loading: false,
        title: "Home admin",
        animes: []
    }

    async componentDidMount() {
        const res = await this.getFromApiWithToken<AnimeSummary[]>("/anime/all?summary=true&page=1")
        if(res?.data.success){
            this.setState({animes: res.data.data})
        }
    }

    protected renderContent(): React.ReactNode {
        return(
            <div className="main-home">
                <div className='main'>
                    <div className='division'>
                        <Link to={"/anime/new"}>Novo Anime</Link>
                        <Link to={"/genre"}>Gêneros</Link>
                        <Link to={"/state/new"}>Novo Estado de Lançamento</Link>
                        <Link to={"/produtor/new"}>Novo Produtor</Link>
                        <Link to={"/creator/new"}>Novo Criador</Link>
                        <Link to={"/studio/new"}>Novo Estúdio</Link>
                    </div>
                </div>
                <main>
                    <h1>Admin page</h1>
                    <div className="anime-list">
                        {this.state.animes.map((item) =>
                            <AnimeHomeList
                                anime={item}
                            />
                        )}
                    </div>
                </main>
            </div>
        )
    }

}
export default Home;