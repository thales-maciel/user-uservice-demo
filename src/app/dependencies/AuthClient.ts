import { RegisterUserInput } from "../../domain";

type UnexpectedProblem = {
  name: 'UnexpectedProblem'
}

type UserAlreadyRegistered = {
  name: 'UserAlreadyRegistered'
}

export type AuthClient = {
  registerUser: (input: RegisterUserInput) => TaskEither<UnexpectedProblem | UserAlreadyRegistered, null>;
};
