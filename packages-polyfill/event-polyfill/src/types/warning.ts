/**
 * The warning information.
 */
export interface IWarningInfo {
  /**
   * The code of this warning.
   */
  code: string;
  /**
   * The message in English.
   */
  message: string;
  /**
   * The arguments for replacing placeholders in the text.
   */
  args: unknown[];
}

/**
 * The warning handler.
 */
export type TWarningHandler = (warning: IWarningInfo) => void;
