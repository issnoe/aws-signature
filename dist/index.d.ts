interface AWSConfiguration {
    accessKey: string;
    secretKey: string;
    region?: string;
    service?: string;
    method?: string;
    host?: string;
    endpoint?: string;
    contentType?: string;
    body?: any;
}
interface AWSAuthorization {
    'Host': string;
    'X-Amz-Date': string;
    'Authorization': string;
    'Content-Type': string;
}
export declare function sing(config: AWSConfiguration): AWSAuthorization;
export {};
