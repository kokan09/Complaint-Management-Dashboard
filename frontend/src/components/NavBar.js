import React from 'react';
import { NavLink } from 'react-router';

const NavBar = () => {
  return (
    <nav>
        <NavLink to="/dashboard" className={({isActive}) => (isActive ? "active" : "" )}>Dashborad</NavLink>
        <NavLink to="/complaints" className={({isActive}) => (isActive ? "active" : "" )}>Complaints</NavLink>
        <NavLink to="/analytics" className={({isActive}) => (isActive ? "active" : "" )}>Analytics</NavLink>
        
    </nav>
  )
}

export default NavBar
