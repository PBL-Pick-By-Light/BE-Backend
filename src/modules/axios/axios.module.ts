import {Axios, AxiosRequestConfig} from "axios";
import {ResponseWrapper} from "../../models/response.model";
import {printToConsole} from"../../modules/util/util.module";

export class AxiosModule {

    axios: Axios;

    constructor(axiosConfig: AxiosRequestConfig) {
        this.axios = new Axios(axiosConfig);
    }

    async postRequest(path: string, body: string): Promise<ResponseWrapper> {

        let embeddedResponse: ResponseWrapper = {
            status: 0,
            statusText: ""
        }

        const response = await this.axios.post(path, body);
        const status = response.status;
        printToConsole(`POST request to ${path} done! Status: ${status}`);

        embeddedResponse.status = status;
        embeddedResponse.statusText = response.statusText;
        embeddedResponse.data = response.data;

        return embeddedResponse;

    }

    async getRequest(path: string): Promise<ResponseWrapper> {

        let embeddedResponse: ResponseWrapper = {
            status: 0,
            statusText: ""
        }

        const response = await this.axios.get(path);
        const status = response.status;
        printToConsole(`GET request to ${path} done! Status: ${status}`);

        embeddedResponse.status = status;
        embeddedResponse.statusText = response.statusText;
        embeddedResponse.data = response.data;

        return embeddedResponse;

    }

    async putRequest(path: string, body: string): Promise<ResponseWrapper> {

        let embeddedResponse: ResponseWrapper = {
            status: 0,
            statusText: ""
        }

        const response = await this.axios.put(path, body);
        const status = response.status;
        printToConsole(`PUT request to ${path} done! Status: ${status}`);

        embeddedResponse.status = status;
        embeddedResponse.statusText = response.statusText;
        embeddedResponse.data = response.data;

        return embeddedResponse;

    }

}
