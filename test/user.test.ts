import { assert } from 'chai'
import { v4 as uuid } from "uuid"
import { registerUserInputCodec } from "../src/domain/user"

describe('User', () => {
  it('accepts correct input', () => {
    const userInput = {
      password: 'xD9Lt6T*P8dNU4AA',
      userId: uuid(),
      username: 'some_username'
    }
    const result = registerUserInputCodec.decode(userInput)
    assert.isTrue(E.isRight(result))
  })
})
