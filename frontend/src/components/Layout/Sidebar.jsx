import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const studentNav = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/courses', icon: '📚', label: 'Browse Courses' },
  { to: '/my-courses', icon: '🎓', label: 'My Courses' },
]

const adminNav = [
  { to: '/admin', icon: '⊞', label: 'Overview' },
  { to: '/admin/courses', icon: '📚', label: 'Manage Courses' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/courses', icon: '🌐', label: 'Browse (Public)' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'admin' ? adminNav : studentNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">SkillNest</div>
        <div className="logo-sub">Course Platform</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">
          {user?.role === 'admin' ? 'Admin Panel' : 'Navigation'}
        </div>

        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: 20 }}>Account</div>
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <span className="nav-icon">↩</span>
          Logout
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{getInitials(user?.name)}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
