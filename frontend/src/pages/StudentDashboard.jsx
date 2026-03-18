import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/Layout/AppLayout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import { getCategoryEmoji, getCategoryGradient, formatDate } from '../../src/utils/helpers'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ enrollments: [], stats: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/enrollments/my/courses')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const recentEnrollments = data.enrollments.slice(0, 3)

  return (
    <AppLayout title="Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%)',
        border: '1px solid rgba(102,126,234,0.2)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {data.stats.total > 0
              ? `You're enrolled in ${data.stats.total} course${data.stats.total > 1 ? 's' : ''}. Keep it up!`
              : 'Start your learning journey today.'}
          </p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          Browse Courses →
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div>
            <div className="stat-value">{data.stats.total || 0}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">▶</div>
          <div>
            <div className="stat-value">{data.stats.active || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🏆</div>
          <div>
            <div className="stat-value">{data.stats.completed || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🔥</div>
          <div>
            <div className="stat-value">
              {data.enrollments.length > 0
                ? Math.round(data.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / data.enrollments.length)
                : 0}%
            </div>
            <div className="stat-label">Avg. Progress</div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="section-header">
        <span className="section-title">📖 Continue Learning</span>
        {data.enrollments.length > 3 && (
          <Link to="/my-courses" className="btn btn-outline btn-sm">View All</Link>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : recentEnrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No courses yet</h3>
          <p>Enroll in your first course to get started</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentEnrollments.map(enrollment => (
            enrollment.course && (
              <div key={enrollment._id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'var(--transition)'
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: getCategoryGradient(enrollment.course.category),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {getCategoryEmoji(enrollment.course.category)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, fontFamily: 'var(--font-display)' }}>
                    {enrollment.course.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {enrollment.course.instructor} · Enrolled {formatDate(enrollment.enrolledAt)}
                  </div>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {enrollment.progress}%
                  </div>
                  <span className={`badge ${enrollment.status === 'completed' ? 'badge-green' : 'badge-purple'}`}>
                    {enrollment.status}
                  </span>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </AppLayout>
  )
}
