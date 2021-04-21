import React from "react"
import { NavLink } from 'react-router-dom'

export default function Layout(props) {
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
        <button onClick={props.onLogout} className="py-2 px-4 rounded bg-green-500 text-lg">Logout</button>  
      </div>
      {props.children}
    </div>
  )
}
