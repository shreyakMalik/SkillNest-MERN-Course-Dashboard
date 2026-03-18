import { useState, useEffect } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import { getInitials, formatDate } from '../../src/utils/helpers'

export default function AdminUsers() {
  const { user: currentUser, showToast } = useAuth()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users')
      .then(res => { setUsers(res.data.users); setStats(res.data.stats) })
      .catch(() => showToast('Failed to load users', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (u) => {
    if (u._id === currentUser._id) { showToast('Cannot delete your own account', 'error'); return }
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return
    setDeleting(u._id)
    try {
      await api.delete(`/users/${u._id}`)
      setUsers(prev => prev.filter(x => x._id !== u._id))
      showToast(`User "${u.name}" deleted`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout title="Users">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {stats.total || 0} total · {stats.students || 0} students · {stats.admins || 0} admins
          </p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div><div className="stat-value">{stats.total || 0}</div><div className="stat-label">Total Users</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🎓</div>
          <div><div className="stat-value">{stats.students || 0}</div><div className="stat-label">Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🛡</div>
          <div><div className="stat-value">{stats.admins || 0}</div><div className="stat-label">Admins</div></div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
          <span className="search-icon">🔍</span>
          <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSearch('')}>✕</span>}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>Users will appear here once they register</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: u.role === 'admin' ? 'linear-gradient(135deg, #fa8231, #f7b731)' : 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.78rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0
                      }}>
                        {getInitials(u.name)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.name}
                        {u._id === currentUser._id && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 6 }}>(you)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-orange' : 'badge-purple'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    {u._id !== currentUser._id ? (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deleting === u._id}
                        onClick={() => handleDelete(u)}
                      >
                        {deleting === u._id ? '...' : 'Delete'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
