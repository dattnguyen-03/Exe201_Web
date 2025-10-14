import React, { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
  role: 'parent' | 'admin' | 'teacher'
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
