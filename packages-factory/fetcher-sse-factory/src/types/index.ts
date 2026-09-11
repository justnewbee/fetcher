export interface IFetcherSseFactoryOptions {
  urlBase?: string;
  getHeaders?(): Record<string, string>;
}
