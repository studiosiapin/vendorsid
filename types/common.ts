// eslint-disable-next-line
export type BaseAPIResponse<T = any> = {
    message: string;
    code: number;
    data?: T;
    // eslint-disable-next-line
    errors?: any;
    pagination?: Pagination;
    total?: number;
};

export type Pagination = {
    page: number;
    total_page: number;
    total_data: number;
};

export type ErorrField = {
    field: string;
    msg: string;
};

export type DataErrorResponse = {
    error_messages?: ErorrField[] | string[];
    message?: string;
    code?: number;
};
