export declare function sendRequest(): string;
interface AWSConfiguration {
    accessKey: string;
    secretKey: string;
    region?: string;
    service?: string;
}
interface AWSAuthorization {
    'Host': string;
    'X-Amz-Date': string;
    'Authorization': string;
    'Content-Type': string;
}
export declare function sing(config: AWSConfiguration): AWSAuthorization;
export {};
