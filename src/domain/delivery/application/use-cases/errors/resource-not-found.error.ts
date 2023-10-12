export class ResourceNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Resource with identifier "${identifier}" not found`)
  }
}
