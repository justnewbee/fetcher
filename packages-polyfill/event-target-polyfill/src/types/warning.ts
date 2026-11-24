/**
 * The warning information.
 */
export interface IWarning {
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
 * @param warning The warning.
 */
export type TWarningHandler = (warning: IWarning) => void;
