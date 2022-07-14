export type UserCreationAttributes = {
  email: string
}

export type UserAttributes = {
  id?: string
  email: string
}

export type OutboxCreationAttributes = {
  message: string
}

export type OutboxAttributes = {
  id?: string
  message: string
}
