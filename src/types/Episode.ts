export interface Episode{
    id:string
    epIndex:number;
    dateAdded:Date;
    name:string;
    animeId:string;
    seasonId:string
    releaseDate:Date;
    views?:number;
    duration:number;
    openingStart:number;
    openingEnd:number;
    ending:number;
    audiotracks:string[];
    subtitlesTracks?:string[];
    resolution:string[]
    visible:boolean;
}
export interface EpisodeDTO extends Episode{
    animeTitle: string;
    seasonTitle: string;
}
