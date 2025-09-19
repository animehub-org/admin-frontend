export const UserRole = {
    DEVELOPER: "ROLE_DEVELOPER",
    USER: "ROLE_USER",
    ADMIN: "ROLE_ADMIN",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface Role{
    id: number;
    name:UserRole
}
