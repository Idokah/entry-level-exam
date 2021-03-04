import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTickets: (search : string) => Promise<Ticket[]>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (search : string) => {
            return axios.get(APIRootPath,
                {
                    params: {
                        search: search
                    }
                }).then((res) => res.data);
        }
    }
}
