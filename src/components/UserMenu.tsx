import { context } from "msw";
import { FC } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../contexts/auth-context";
import { IUser } from "../interfaces";
import authService from '../services/auth'

interface IUserMenu {
  user: IUser | null | undefined
}

const UserMenu: FC<IUserMenu> = ({ user }) => {
  const navigate = useNavigate()
  // const { signout } = useAuthContext()

  const logout = () => {
    // signout()
    navigate('/login')
  }

  return (
    <div className="user-menu">
      <span>
          Hi, {user?.name}
      </span>
      <a onClick={logout} className="py-2 px-4 text-green-500 text-lg" role="button">Logout</a>
    </div>
  )
}

export default UserMenu;
