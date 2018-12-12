export interface AWSConfiguration {
    accessKey: string;
    secretKey: string;
    region: string;
    service: string;
    method?: string;
    host?: string;
    endpoint?: string;
    contentType?: string;
    body?: any;
}
export interface AWSAuthorization {
    'Host': string;
    'X-Amz-Date': string;
    'Authorization': string;
    'Content-Type': string;
}
export interface DateISO {
    'date': string;
    'dateISO': string;
}
