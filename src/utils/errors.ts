export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedActionError extends Error {
  constructor(action: string) {
    super(`Unauthorized to perform action: ${action}`)
    this.name = 'UnauthorizedActionError'
  }
}

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApplicationError'
  }
}

export type ErrorResponse<T> = {
  success: boolean
  message?: string
  data?: T
  type?: 'error' | 'success' | 'warning' | 'info'
}
