export const Audio = {
    DUB :"Dublado",
    LEG : "Legendado",
    BOTH : "Dublado/Legendado"
} as const;
export type Audio = typeof Audio[keyof typeof Audio]