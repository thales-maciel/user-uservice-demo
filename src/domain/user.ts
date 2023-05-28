import * as t from 'io-ts'

type UserIdBrand = {
  readonly UserId: unique symbol
}

const userIdCodec = t.brand(
  t.string,
  (value): value is t.Branded<string, UserIdBrand> => isUUID(value),
  'UserId',
)

const isUUID = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    value,
  )

type UserId = t.TypeOf<typeof userIdCodec>

type UsernameBrand = {
  readonly Username: unique symbol
}

const usernameCodec = t.brand(
  t.string,
  (value): value is t.Branded<string, UsernameBrand> => isValidUsername(value),
  'Username',
)

const isValidUsername = (value: string) => /^[A-Za-z0-9_]{3,24}$/.test(value)

type Username = t.TypeOf<typeof usernameCodec>

type PasswordBrand = {
  readonly Password: unique symbol
}

const passwordCodec = t.brand(
  t.string,
  (value): value is t.Branded<string, PasswordBrand> => isValidPassword(value),
  'Password',
)

type Password = t.TypeOf<typeof passwordCodec>

function containsDigit(str: string): boolean {
  return /\d/.test(str)
}

function containsSpecialChar(str: string): boolean {
  return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str)
}

function containsUppercaseChar(str: string): boolean {
  return /[A-Z]/.test(str)
}

function containsLowercaseChar(str: string): boolean {
  return /[a-z]/.test(str)
}

function hasMinLength(str: string): boolean {
  return str.length >= 8
}

function isValidPassword(value: string): boolean {
  return [
    hasMinLength,
    containsDigit,
    containsSpecialChar,
    containsUppercaseChar,
    containsLowercaseChar,
  ]
    .map((it) => it(value))
    .every(Boolean)
}

type RegisterUserInputBrand = {
  readonly RegisterUserInput: unique symbol
}

export const registerUserInputCodec = t.brand(
  t.type({
    password: passwordCodec,
    userId: userIdCodec,
    username: usernameCodec,
  }),
  (
    v,
  ): v is t.Branded<
    { userId: UserId; username: Username; password: Password },
    RegisterUserInputBrand
  > => true,
  'RegisterUserInput',
)

export type RegisterUserInput = t.TypeOf<typeof registerUserInputCodec>
