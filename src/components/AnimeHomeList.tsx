import type {AnimeSummary} from "../types/Anime.ts";
import React from "react";

class AnimeHomeList extends React.PureComponent<{anime: AnimeSummary}>{
    render() {
        const anime = this.props.anime;
        return <div>
            <p>{anime.name}</p>
        </div>
    }
}
export default AnimeHomeList;