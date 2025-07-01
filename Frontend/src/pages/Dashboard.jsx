import React from 'react'
import { Link } from 'react-router-dom'
import LinkDashboard from './links/LinkDashboard'

function Dashboard() {
  return (
    <div className='container text-center'>

        <LinkDashboard/>
        <Link to='/logout'> Logout </Link>
    </div>
  )
}

export default Dashboard
