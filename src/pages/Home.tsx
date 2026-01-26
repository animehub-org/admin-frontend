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
        const res = await this.getFromApiWithToken<AnimeSummary[]>("/g/anime/all?summary=true&page=1")
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
                        <Link to={"/state"}>Estado de lançamento</Link>
                        <Link to={"/produtor"}>Produtores</Link>
                        <Link to={"/creator"}>Criadores</Link>
                        <Link to={"/studio"}>Estúdio</Link>
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