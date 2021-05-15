import React from "react"
import { NavLink } from 'react-router-dom'
import { apiClient } from '../api';

type Props = {
  onSetLoginStatus: (status: boolean) => void,
  children: React.ReactNode
}

export default function Layout(props: Props) {
  const logout = () => {
    apiClient.post('/logout').then(response => {
        if (response.status === 204) {
          props.onSetLoginStatus(false);
          sessionStorage.setItem('loggedIn', 'false');
        }
      }).catch(error => {
          console.error(error);
      });
  }

  return (
    <div className="px-40 py-5">
      <div className="flex justify-between">
        <NavLink
          to="/patients"
          activeClassName="text-green-500"
          className="text-xl"
        >
          Patients
        </NavLink>
        <button onClick={logout} className="py-2 px-4 rounded bg-green-500 text-lg">Logout</button>  
      </div>
      {props.children}
    </div>
  )
}
