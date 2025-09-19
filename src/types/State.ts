export interface State{
    id:number;
    name:string;
}
export const StateNames = {
    ONGOING:"Lançando",
    HIATUS:"Hiáto",
    COMPLETED:"Completo",
    CANCELED: "Cancelado",
    NOTARING: "Não Lançado"
} as const;
export type StateName = typeof StateNames[keyof typeof StateNames];