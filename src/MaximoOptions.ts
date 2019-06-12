// tslint:disable-next-line: interface-name
export interface MaximoOptions {
    protocol?: string;
    host: string;
    port?: number;
    user: string;
    password: string;
    authorizationScheme?: "MAX_AUTH" | "BASIC" | "FORM";
    lean?: boolean;
}
