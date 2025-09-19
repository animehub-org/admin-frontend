import type {Episode, EpisodeDTO} from "./Episode.ts";

export interface Season{
    id:string;
    name: string;
    episodes: Episode[];
    index: number;
    anime_id:string;
}
export interface SeasonDTO extends Season{
    episodes:EpisodeDTO[]
}