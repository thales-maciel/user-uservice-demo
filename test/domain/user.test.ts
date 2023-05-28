import '../../src/globals'
import { v4 as uuid } from "uuid"
import { registerUserInputCodec } from "../../src/domain/user"
import fc from 'fast-check'
import { not } from 'fp-ts/lib/Predicate'

const validPassword = fc.string().filter(passwordIsValid)
const validUsername = fc.string().filter(usernameIsValid)
const invalidPassword = fc.string().filter(not(passwordIsValid))
const invalidUsername = fc.string().filter(not(usernameIsValid))

describe('User', () => {
  it('Instantiates registerUserInput with Valid Input', () => {
    fc.assert(
      fc.property(validPassword, validUsername, (password, username) => {
        const userInput = {
          password,
          userId: uuid(),
          username,
        }
        return pipe(userInput, registerUserInputCodec.decode, E.isRight)
      })
    )
  })
  describe('Prevents registerUserInput instantiation with invalid Input', () => {
    it('With invalid password', () => {
      fc.assert(
        fc.property(invalidPassword, validUsername, (password, username) => {
          const userInput = {
            password,
            userId: uuid(),
            username,
          }
          return pipe(userInput, registerUserInputCodec.decode, E.isLeft)
        })
      )
    })
    it('With invalid username', () => {
      fc.assert(
        fc.property(validPassword, invalidUsername, (password, username) => {
          const userInput = {
            password,
            userId: uuid(),
            username,
          }
          return pipe(userInput, registerUserInputCodec.decode, E.isLeft)
        })
      )
    })
    it('With invalid password and username', () => {
      fc.assert(
        fc.property(invalidPassword, invalidUsername, (password, username) => {
          const userInput = {
            password,
            userId: uuid(),
            username,
          }
          return pipe(userInput, registerUserInputCodec.decode, E.isLeft)
        })
      )
    })
  })
})

function containsDigit(str: string): boolean {
  for (const char of str) {
    if (char >= '0' && char <= '9') {
      return true;
    }
  }
  return false;
}

function containsUppercase(str: string): boolean {
  for (const char of str) {
    if (char >= 'A' && char <= 'Z') {
      return true;
    }
  }
  return false;
}

function containsLowercase(str: string): boolean {
  for (const char of str) {
    if (char >= 'a' && char <= 'z') {
      return true;
    }
  }
  return false;
}

function hasSpecialCharacter(str: string): boolean {
  const allowedCharacters = "`!@#$%^&*()_+[-={}];':\"\\|,.<>/?~";
  
  for (const char of str) {
    if (allowedCharacters.includes(char)) {
      return true;
    }
  }
  
  return false;
}

function passwordHasValidLength(str: string): boolean {
  const length = str.length;
  return length >= 8 && length <= 256;
}

function passwordIsValid(str: string): boolean {
  return [
    passwordHasValidLength,
    containsDigit,
    containsUppercase,
    containsLowercase,
    hasSpecialCharacter,
  ]
    .map((it) => it(str))
    .every(Boolean)

}

function usernameHasNoWhitespaces(str: string): boolean {
  return !str.includes(' ')
}

function usernameHasValidLength(str: string): boolean {
  const length = str.length
  return length >= 3 && length <= 24
}

function usernameHasNoSpecialChars(str: string): boolean {
  const forbiddenCharacters = "`!@#$%^&*()+[-={}];':\"\\|,.<>/?~";

  for (const char of str) {
    if (forbiddenCharacters.includes(char)) {
      return false;
    }
  }
  
  return true;
}

function usernameIsValid(str: string): boolean {
  return [
    usernameHasNoWhitespaces,
    usernameHasValidLength,
    usernameHasNoSpecialChars
  ]
    .map((it) => it(str))
    .every(Boolean)
}