import BasePage from "./BasePage.tsx";
import "../css/homePage.scss"
import type {BaseProps, BaseState} from "../types/PageTypes.ts";
import type {AnimeSummary} from "../types/Anime.ts";
import AnimeHomeList from "../components/AnimeHomeList.tsx";

type HomePageState = BaseState & {
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
        if(res.data.success){
            this.setState({animes: res.data.data})
        }
    }

    protected renderContent(): React.ReactNode {
        return(
            <div className="main-home">
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