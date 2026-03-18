import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/Layout/AppLayout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import { getCategoryEmoji, getCategoryGradient, formatDate } from '../../src/utils/helpers'

export default function MyCourses() {
  const { showToast } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [unenrolling, setUnenrolling] = useState(null)
  const [updatingProgress, setUpdatingProgress] = useState(null)

  const fetchEnrollments = () => {
    setLoading(true)
    api.get('/enrollments/my/courses')
      .then(res => { setEnrollments(res.data.enrollments); setStats(res.data.stats) })
      .catch(() => showToast('Failed to load courses', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEnrollments() }, [])

  const handleUnenroll = async (courseId, courseTitle) => {
    if (!confirm(`Unenroll from "${courseTitle}"?`)) return
    setUnenrolling(courseId)
    try {
      await api.delete(`/enrollments/${courseId}`)
      setEnrollments(prev => prev.filter(e => e.course?._id !== courseId))
      showToast(`Unenrolled from "${courseTitle}"`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to unenroll', 'error')
    } finally {
      setUnenrolling(null)
    }
  }

  const handleProgress = async (courseId, progress) => {
    setUpdatingProgress(courseId)
    try {
      const res = await api.patch(`/enrollments/${courseId}/progress`, { progress: Number(progress) })
      setEnrollments(prev => prev.map(e =>
        e.course?._id === courseId ? { ...e, progress: res.data.enrollment.progress, status: res.data.enrollment.status } : e
      ))
      if (Number(progress) === 100) showToast('🎉 Course completed!')
    } catch (err) {
      showToast('Failed to update progress', 'error')
    } finally {
      setUpdatingProgress(null)
    }
  }

  return (
    <AppLayout title="My Courses">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Track your learning progress</p>
        </div>
        <Link to="/courses" className="btn btn-primary">+ Enroll More</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div><div className="stat-value">{stats.total || 0}</div><div className="stat-label">Total Enrolled</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">▶</div>
          <div><div className="stat-value">{stats.active || 0}</div><div className="stat-label">In Progress</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🏆</div>
          <div><div className="stat-value">{stats.completed || 0}</div><div className="stat-label">Completed</div></div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No courses enrolled yet</h3>
          <p>Start learning by enrolling in a course</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Courses</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {enrollments.map(enrollment => (
            enrollment.course && (
              <div key={enrollment._id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Icon */}
                <div style={{
                  width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                  background: getCategoryGradient(enrollment.course.category),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
                }}>
                  {getCategoryEmoji(enrollment.course.category)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {enrollment.course.title}
                    </h3>
                    <span className={`badge ${enrollment.status === 'completed' ? 'badge-green' : 'badge-purple'}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    👤 {enrollment.course.instructor} · Enrolled {formatDate(enrollment.enrolledAt)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', minWidth: 36 }}>
                      {enrollment.progress}%
                    </span>
                  </div>

                  {/* Progress updater */}
                  {enrollment.status !== 'completed' && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      {[25, 50, 75, 100].map(p => (
                        enrollment.progress < p && (
                          <button
                            key={p}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                            disabled={updatingProgress === enrollment.course._id}
                            onClick={() => handleProgress(enrollment.course._id, p)}
                          >
                            Mark {p}%
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                    ⏱ {enrollment.course.duration}
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={unenrolling === enrollment.course._id}
                    onClick={() => handleUnenroll(enrollment.course._id, enrollment.course.title)}
                  >
                    {unenrolling === enrollment.course._id ? '...' : 'Unenroll'}
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </AppLayout>
  )
}
