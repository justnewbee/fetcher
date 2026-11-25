/**
 * Define explicit `type` property if the given type is a string literal.
 * Otherwise, never.
 */
export type TExplicitEventType<Type extends string> = string extends Type ? never : {
  readonly type: Type;
};

/**
 * Check if given event map is valid.
 * It's valid if the keys of the event map are narrower than `string`.
 */
export type TIsValidEventMap<Type> = string extends keyof Type ? false : true;

/**
 * Internal data of an `AbortSignal`.
 */
export interface IAbortSignalInternalData {
  aborted: boolean;
  reason: unknown;
}
