import type {Role} from "./Role.ts";
import type {AnimeUser} from "./Anime.ts";

export default interface User {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    birthDate: Date;
    roles: Role[];
    animelist: AnimeUser
}

export const userAnimeState = {
    watching:"Assistindo",
    completed:"Completado",
    on_hold:"Em espera",
    dropped:"Desistido",
    plan_to_watch:"Pretendo assistir"
} as const;
export type userAnimeState = typeof userAnimeState[keyof typeof userAnimeState];

export const priorityValue = {
    LOW:"Baixa",
    MEDIUM:"Media",
    HIGH:"Alta"
} as const;
export type Priority = typeof priorityValue[keyof typeof priorityValue];