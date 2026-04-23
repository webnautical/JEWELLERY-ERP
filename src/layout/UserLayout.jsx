import React, { useState, useEffect } from 'react'
import { Header } from '../user/inc/Header'
import Sidebar from '../user/inc/Sidebar'
import { authUser } from '../helper/Utility'
import { Navigate } from 'react-router-dom'

const UserLayout = ({ cmp }) => {
  const Component = cmp
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const auth = authUser()
  if (!auth || !auth?.token) {
    return <Navigate to="/login" replace />
  }

  console.log("auth",auth)



  return (
    <div style={{ 
      background: '#F7F7F7', 
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <Sidebar />
      <div style={{ 
        marginLeft: isMobile ? '0' : '255px',
        width: isMobile ? '100%' : 'calc(100% - 255px)',
        transition: 'all 0.3s ease-in-out'
      }}>
        <Header />
        <main style={{ 
          paddingTop: '62px',
          width: '100%',
          overflowX: 'hidden'
        }}>
          <Component />
        </main>
      </div>
    </div>
  )
}

export default UserLayout