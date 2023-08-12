export function isInstanceOfError(error: unknown): error is Error {
  return error instanceof Error;
}
