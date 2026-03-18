import { useState, useEffect, useCallback } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import CourseCard from '../components/Student/CourseCard'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Machine Learning', 'Cybersecurity', 'Other']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function BrowseCourses() {
  const { user, showToast } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [total, setTotal] = useState(0)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category !== 'All') params.category = category
      if (level !== 'All') params.level = level
      const res = await api.get('/courses', { params })
      setCourses(res.data.courses)
      setTotal(res.data.total)
    } catch (err) {
      showToast('Failed to load courses', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, category, level])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  useEffect(() => {
    if (user) {
      api.get('/enrollments/my/courses')
        .then(res => setEnrolledIds(new Set(res.data.enrollments.map(e => e.course?._id))))
        .catch(() => {})
    }
  }, [user])

  const handleEnroll = async (courseId, courseTitle) => {
    if (!user) { showToast('Please login to enroll', 'error'); return }
    setEnrolling(courseId)
    try {
      await api.post(`/enrollments/${courseId}`)
      setEnrolledIds(prev => new Set([...prev, courseId]))
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, enrollmentCount: c.enrollmentCount + 1 } : c))
      showToast(`Enrolled in "${courseTitle}" successfully!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error')
    } finally {
      setEnrolling(null)
    }
  }

  return (
    <AppLayout title="Browse Courses">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Browse Courses</h1>
          <p className="page-subtitle">{total} course{total !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search courses, instructors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSearch('')}>✕</span>
          )}
        </div>

        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {(search || category !== 'All' || level !== 'All') && (
          <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setCategory('All'); setLevel('All') }}>
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={enrolledIds.has(course._id)}
              onEnroll={handleEnroll}
              enrolling={enrolling}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}
