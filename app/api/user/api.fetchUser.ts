import { NextResponse } from "next/server";

type PostResponse = { success: boolean; error: string};
type PutResponse = { updated: boolean; error: string };
type PatchResponse = { patched: boolean; error: string };
type DeleteResponse = { deleted: boolean; error: string };

type FetchArguments = {
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE", 
    path: string,
    isAuth?: boolean,
    headers?: Record<string, string>,
    body?: Record<string, string>
}

type GetArguments = {
    email: string | undefined,
    username: string | undefined,
};




class FetchClient {

    constructor(private defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    }) {}

    private async fetch({method, path, isAuth = false, headers, body}: FetchArguments): Promise<NextResponse> {

        const fullURL = process.env.API_URL + path;
        const allRequestHeaders: Record<string, string> = {...this.defaultHeaders, ...(headers || {})};
        
        switch (method) {
            
            case "GET": 
                try {
                    const response = await fetch(fullURL, {method, headers: allRequestHeaders});
                    const data = await response.json();
                    if (!response.ok) {
                        return NextResponse.json({error: data.error}, {status: response.status});
                    }
                    else {
                        return NextResponse.json({exists: data.exists}, {status: 200});
                    }
                }    
                catch {
                    const fetchError = "Error during data fetch from API";
                    return NextResponse.json({error: fetchError}, {status: 500});
                }

            default:
                const methodError = "Error: unsupported HTTP method.";    
                return NextResponse.json({error: methodError}, {status: 405});
        }
    }
    

    async get<T>({email, username}: GetArguments): Promise<NextResponse> {
        let path = "";
        if (email) {path = `/api/user?email=${email}`}
        else if (username) {path = `api/user?username=${username}`};
        
        const response = await this.fetch({method: 'GET', path: path});
        return response;
    }

    /*async post<T>(
        isAuth: boolean = false, 
        headers?: Record<string, string>, 
        body?: Record<string, any>
    ): Promise<T> {
        return this.fetch<T>('POST', isAuth, headers, body);
    }

    async patch<T> (
        path: string, 
        isAuth: boolean = false,
        headers?: Record<string, string>,
        body?: Record<string, string>
    ): Promise<T> {
        return this.fetch<T>('PATCH', isAuth, headers, body);
    }

    async put<T>(
        isAuth: boolean = false, 
        headers?: Record<string, string>, 
        body?: Record<string, any>
    ): Promise<T> {
        return this.fetch('PUT', isAuth, headers, body)
    }
    
    async delete<T>(
        path: string, 
        isAuth: boolean = false, 
        headers?: Record<string, string>
    ): Promise<T> {
        return this.fetch<T>('DELETE', isAuth, headers);
    }*/
}

export const $fetch = new FetchClient();