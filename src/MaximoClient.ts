import axios, { AxiosInstance } from "axios";

import MaximoClientError from "./MaximoClientError";
import { MaximoOptions } from "./MaximoOptions";

export class MaximoClient {
    private maximoOptions: MaximoOptions;
    private baseUrl: string;
    private session: AxiosInstance;

    constructor(options: MaximoOptions) {
        this.maximoOptions = {
            authorizationScheme: options.authorizationScheme || "MAX_AUTH",
            host: options.host,
            lean: true,
            password: options.password,
            port: options.port || 9080,
            protocol: options.protocol || "http",
            user: options.user,
        };
        this.baseUrl = `${this.maximoOptions.protocol}://${this.maximoOptions.host}:${this.maximoOptions.port}`;
    }

    /**
     * Retrieves one or more Maximo resources
     * @param resourceName Name of the Maximo resource to retrieve
     * @param whereClause A where clause to filter retrieved resources
     */
    public async getResources(resourceName: string, whereClause?: string): Promise<any[]>;
    /**
     * Retrieves one or more Maximo resources
     * @param resourceName Name of the Maximo resource to retrieve
     * @param fields An array of field names which to get from the resource
     * @param whereClause A where clause to filter retrieved resources
     */
    public async getResources(resourceName: string, fields?: string[], whereClause?: string): Promise<any[]>;
    public async getResources(resourceName: string, fieldsOrWhere?: string[] | string, whereClause?: string) {
        const axiosInstance = this.session || await this.authorize();
        let response;
        let whereString: string = null;
        let selectString: string = null;

        if (typeof fieldsOrWhere === "string") {
            whereString = fieldsOrWhere;
        } else if (Array.isArray(fieldsOrWhere)) {
            selectString = fieldsOrWhere.join();
            whereString = whereClause || null;
        }

        try {
            response = await axiosInstance.get(`${this.baseUrl}/maximo/oslc/os/${resourceName}`, {
                params: {
                    ["oslc.select"]: selectString,
                    ["oslc.where"]: whereString,
                    lean: this.maximoOptions.lean ? 1 : 0,
                },
            });
        } catch (err) {
            throw new MaximoClientError(err.response.status, err.response.statusText, err.response.data,
                "Failed to get the resources");
        }
        return response.data.member;
    }

    /**
     * Retrieves a single resource by its URI
     * @param resourceUri URI of the resource which to retrieve.
     * Can be created by using the {@link #getResources | getResources() method}
     * @param fields Select fields to return in the resource. Equivalent to oslc.select.
     */
    public async getResource(resourceUri: string, fields?: string[]): Promise<any> {
        const axiosInstance = this.session || await this.authorize();
        let response;
        const selectString = fields ? fields.join() : null;
        try {
            response = await axiosInstance.get(`${resourceUri}`, {
                params: {
                    ["oslc.select"]: selectString,
                    lean: this.maximoOptions.lean ? 1 : 0,
                },
            });
        } catch (err) {
            throw new MaximoClientError(err.response.status, err.response.statusText, err.response.data,
                "Failed to get the resource");
        }
        return response.data;
    }
    /**
     * Creates a new resource with the specified contents
     * @param resourceName Name of the resource to create
     * @param resourceBody Content and fields of the new resource
     */
    public async createResource(resourceName: string, resourceBody: any) {
        const axiosInstance = this.session || await this.authorize();
        let response;
        try {
            response = await axiosInstance.post(`${this.baseUrl}/maximo/oslc/os/${resourceName}`, resourceBody, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    lean: this.maximoOptions.lean ? 1 : 0,
                },
            });
        } catch (err) {
            throw new MaximoClientError(err.response.status, err.response.statusText, err.response.data,
                "Failed to create the resource");
        }
        return response;
    }
    /**
     * Updates a resource
     * @param resourceUri URI of the resource on which to perform updates.
     * @param resourceBody Content and fields to be updated
     * @param merge True if you want to set patchtype to MERGE
     */
    public async updateResource(resourceUri: string, resourceBody: any, merge = false) {
        const axiosInstance = this.session || await this.authorize();
        let response;
        try {
            response = await axiosInstance.post(resourceUri, resourceBody, {
                headers: {
                    "Content-Type": "application/json",
                    "patchtype": merge ? "MERGE" : null,
                    "x-method-override": "PATCH",
                },
                params: {
                    lean: this.maximoOptions.lean ? 1 : 0,
                },
            });
        } catch (err) {
            throw new MaximoClientError(err.response.status, err.response.statusText, err.response.data,
                "Failed to update the resource");
        }
        return response;
    }
    /**
     * Initializes a reusable session
     */
    public async initializeReusableSession(): Promise<void> {
        this.session = await this.authorize();
    }
    /**
     * Authorizes the user and returns an `AxiosInstance` with JSESSIONID
     */
    private async authorize(): Promise<AxiosInstance> {
        let response = null;
        try {
            response = await axios.get(`${this.baseUrl}/maximo/oslc/login`, {
                headers: {
                    maxauth: Buffer.from(`${this.maximoOptions.user}:${this.maximoOptions.password}`)
                        .toString("base64"),
                },
                withCredentials: true,
            });

        } catch (err) {
            throw new MaximoClientError(err.response.status, err.response.statusText, err.response.data,
                "Failed to authorize the given user");
        }
        return axios.create({
            headers: {
                Cookie: response.headers["set-cookie"][0],
            },
            withCredentials: true,
        });
    }
}
