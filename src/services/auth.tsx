import { IUser } from "../interfaces";
import { http } from "../utils/http";
const localStorageKey = '__auth_token__';

export interface ICredential {
  email: string,
  password: string
}

const login = async (credential: ICredential) => {
  const data = await http('login', {data: credential, method: 'POST'})
  const user = data?.user;
  if (user) {
    window.localStorage.setItem(localStorageKey, user.token || "");
  }
  return user;
}

const logout = async () => {
  const res = await http('logout', {method: 'POST'})
  if (res.status == 204) {
    window.localStorage.clear();
  }
}

const getToken = () => window.localStorage.getItem(localStorageKey);

const getUser = async () => {
  const token = getToken()?? '';
  
  return await http('api/me', {token})
}

const authService = {
  login,
  logout,
  getToken,
  getUser
}

export default authService
