export interface Params {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface PaginateModel {
    current_page?: number;
    first_page_url?: string;
    from?: number;
    last_page?: number;
    last_page_url?: string;
    //links?: Link[];
    next_page_url?: string;
    path?: string;
    per_page?: number;
    prev_page_url?: string;
    to?: number;
    totalItems?: number;
}