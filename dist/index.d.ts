import { AWSAuthorization, AWSConfiguration } from './interfaces';
export declare function sing(config: AWSConfiguration): AWSAuthorization;
declare class AWSSignature {
    constructor();
    private encrypt;
    private hash;
    private canonical_headers;
    private signed_headers;
    private canonical_request;
    private parse_service_info;
    private credential_scope;
    private string_to_sign;
    private get_signing_key;
    private get_signature;
    private get_authorization_header;
    private handleSignatute;
    signature(config: any): any;
}
declare const _default: AWSSignature;
export default _default;
