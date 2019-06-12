export default class MaximoClientError extends Error {
    public status: number;
    public statusText: string;
    public body: any;

    constructor(status: number, statusText: string, body?: any, message?: string) {
        super(message);

        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }
}
