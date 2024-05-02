export declare class RESTful {
    private defaultOptions;
    constructor(defaultOptions: RequestInit);
    post(url: string, data?: RequestInit): Promise<Response>;
    get(url: string, data?: RequestInit): Promise<Response>;
    delete(url: string, data?: RequestInit): Promise<Response>;
    options(url: string, data?: RequestInit): Promise<Response>;
    put(url: string, data?: RequestInit): Promise<Response>;
    static post(url: string, data: RequestInit): Promise<Response>;
    static get(url: string, data: RequestInit): Promise<Response>;
    static delete(url: string, data: RequestInit): Promise<Response>;
    static options(url: string, data: RequestInit): Promise<Response>;
    static put(url: string, data: RequestInit): Promise<Response>;
}
