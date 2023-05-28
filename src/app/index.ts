import AppDependencies from './dependencies'
import { RegisterUser, mkRegisterUser } from './registerUser'


export type App = {
  registerUser: RegisterUser
};

export default function App(deps: AppDependencies): App {
  const registerUser = mkRegisterUser(deps)

  return {
    registerUser,
  }
}



