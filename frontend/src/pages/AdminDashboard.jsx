import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/Layout/AppLayout'
import api from '../../src/utils/api'
import { getCategoryEmoji, getCategoryGradient, formatDate } from '../../src/utils/helpers'

export default function AdminDashboard() {
  const [courses, setCourses] = useState([])
  const [users, setUsers] = useState([])
  const [userStats, setUserStats] = useState({})
  const [courseStats, setCourseStats] = useState({})
  const [enrollStats, setEnrollStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/courses/all'),
      api.get('/users'),
      api.get('/users/stats/overview')
    ]).then(([cRes, uRes, sRes]) => {
      setCourses(cRes.data.courses.slice(0, 5))
      setCourseStats(cRes.data.stats)
      setUsers(uRes.data.users.slice(0, 5))
      setUserStats(uRes.data.stats)
      setEnrollStats(sRes.data.stats)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <AppLayout title="Admin Overview">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Admin Overview</h1>
          <p className="page-subtitle">Platform summary at a glance</p>
        </div>
        <Link to="/admin/courses" className="btn btn-primary">+ New Course</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div><div className="stat-value">{courseStats.total || 0}</div><div className="stat-label">Total Courses</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div><div className="stat-value">{userStats.students || 0}</div><div className="stat-label">Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🎓</div>
          <div><div className="stat-value">{enrollStats.totalEnrollments || 0}</div><div className="stat-label">Enrollments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">✓</div>
          <div><div className="stat-value">{enrollStats.completedEnrollments || 0}</div><div className="stat-label">Completed</div></div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent Courses */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: 16 }}>
              <span className="section-title">📚 Recent Courses</span>
              <Link to="/admin/courses" className="btn btn-outline btn-sm">Manage</Link>
            </div>
            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No courses yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {courses.map(c => (
                  <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: getCategoryGradient(c.category),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                    }}>
                      {getCategoryEmoji(c.category)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {c.enrollmentCount} enrolled
                      </div>
                    </div>
                    <span className={`badge ${c.isPublished ? 'badge-green' : 'badge-gray'}`}>
                      {c.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: 16 }}>
              <span className="section-title">👥 Recent Users</span>
              <Link to="/admin/users" className="btn btn-outline btn-sm">View All</Link>
            </div>
            {users.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No users yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {users.map(u => (
                  <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)'
                    }}>
                      {u.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>
                    <span className={`badge ${u.role === 'admin' ? 'badge-orange' : 'badge-purple'}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
