export default function isAbortError(error: Error): boolean {
  return error.name === 'AbortError';
}
