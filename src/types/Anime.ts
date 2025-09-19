import type {Producer} from "./Producer.ts";
import type {State} from "./State.ts";
import type {Audio} from "./Audio.ts";
import type {Quality} from "./Quality.ts";
import type {Priority, userAnimeState} from "./User.ts";
import type {SeasonDTO} from "./Season.ts";

export interface Anime{
    id:string;
    name:string;
    name2:string|undefined;
    description:string;
    quality:Quality;
    language:Audio;
    state:State;
    releaseDate:string;
    studios:Producer[];
    producers:Producer[];
    creators:Producer[];
    genre:string[];
    rating?:number;
    averageEpTime?:number;
    date_added?:Date;
    visible:boolean;
    weekday:string;
    seasons: SeasonDTO[]
}

export interface AnimeSummary{
    id: string;
    genre: string[];
    name: string;
    averageEpTime: number;
    description: string;
}

export interface AnimeUser{
    userId:string;
    anime:AnimeSummary
    status: userAnimeState;
    startDate?:Date;
    finishDate?:Date;
    rate:number;
    priority:Priority;
}