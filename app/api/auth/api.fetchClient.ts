class FetchClient {
   

    constructor(private defaultHeaders: Record<string, string> = {}) {}

    private async fetch<T>(
        method: string, 
        isAuth: boolean,
        headers?: Record<string, string>,
        body?: Record<string, string>
    ): Promise<T> {
        const authorizationHeader: HeadersInit = isAuth ? {Authorization: `Bearer ${localStorage.getItem('token')}`} : {};
        
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaultHeaders,
                    ...authorizationHeader,
                    ...headers
                },
                body: body? JSON.stringify(body) : null
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Fetch error:', data);
                throw new Error('Fetch error: ' + JSON.stringify(data));
            }
            return data;
        } catch (error) {
            console.error('Error in fetch:', error);
            throw error;
        }
    }
    
    async get<T>(
        isAuth: boolean = false, 
        headers?: Record<string, string>
    ): Promise<T> {
        return this.fetch<T>('GET', isAuth, headers);
    }

    async post<T>(
        isAuth: boolean = false, 
        headers?: Record<string, string>, 
        body?: Record<string, any>
    ): Promise<T> {
        return this.fetch<T>('POST', isAuth, headers, body);
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
    }

    async patch<T> (
        path: string, 
        isAuth: boolean = false,
        headers?: Record<string, string>,
        body?: Record<string, string>
    ): Promise<T> {
        return this.fetch<T>('PATCH', isAuth, headers, body);
    }
}

export const restClient = new FetchClient();