export default function defaultErrorInform(error: unknown, title?: string): void {
  if (title) {
    console.info('%c[ErrorInform] %o %c%s', 'color:#09f;', error, 'color:#999;', title); // eslint-disable-line no-console
  } else {
    console.info('%c[ErrorInform] %o', 'color:#09f;', error); // eslint-disable-line no-console
  }
}
