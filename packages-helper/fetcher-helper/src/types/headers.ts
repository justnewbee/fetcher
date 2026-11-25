export type TFetcherHeadersPlain = Record<string, string | number | boolean>;

export type TFetcherHeadersPlainNormalized = Record<string, string>;

export type TFetcherHeaders = Headers | TFetcherHeadersPlain;

export type TFetcherHeadersNormalized = Headers | TFetcherHeadersPlainNormalized;
