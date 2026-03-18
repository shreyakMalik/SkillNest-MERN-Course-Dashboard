import { useState, useEffect } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { useAuth } from '../../src/context/AuthContext'
import api from '../../src/utils/api'
import { getCategoryEmoji, getCategoryGradient, formatPrice } from '../../src/utils/helpers'

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Machine Learning', 'Cybersecurity', 'Other']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const emptyForm = {
  title: '', description: '', instructor: '', category: 'Web Development',
  level: 'Beginner', duration: '', price: 0, tags: '', isPublished: true
}

export default function AdminCourses() {
  const { showToast } = useAuth()
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch] = useState('')

  const fetchCourses = () => {
    setLoading(true)
    api.get('/courses/all')
      .then(res => { setCourses(res.data.courses); setStats(res.data.stats) })
      .catch(() => showToast('Failed to load courses', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [])

  const openCreate = () => { setEditCourse(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (course) => {
    setEditCourse(course)
    setForm({
      title: course.title, description: course.description, instructor: course.instructor,
      category: course.category, level: course.level, duration: course.duration,
      price: course.price, tags: (course.tags || []).join(', '), isPublished: course.isPublished
    })
    setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditCourse(null); setForm(emptyForm) }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }
      if (editCourse) {
        const res = await api.put(`/courses/${editCourse._id}`, payload)
        setCourses(prev => prev.map(c => c._id === editCourse._id ? res.data.course : c))
        showToast('Course updated successfully!')
      } else {
        const res = await api.post('/courses', payload)
        setCourses(prev => [res.data.course, ...prev])
        showToast('Course created successfully!')
      }
      closeModal()
    } catch (err) {
      const errs = err.response?.data?.errors
      showToast(errs ? errs[0].msg : err.response?.data?.message || 'Failed to save course', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (course) => {
    if (!confirm(`Delete "${course.title}"? This will also remove all enrollments.`)) return
    setDeleting(course._id)
    try {
      await api.delete(`/courses/${course._id}`)
      setCourses(prev => prev.filter(c => c._id !== course._id))
      showToast('Course deleted successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout title="Manage Courses">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Manage Courses</h1>
          <p className="page-subtitle">
            {stats.total || 0} total · {stats.published || 0} published · {stats.unpublished || 0} drafts
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Course</button>
      </div>

      {/* Search */}
      <div className="filter-bar">
        <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
          <span className="search-icon">🔍</span>
          <input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSearch('')}>✕</span>}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses found</h3>
          <p>Create your first course to get started</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>Create Course</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th>Enrollments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(course => (
                <tr key={course._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: getCategoryGradient(course.category),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                      }}>
                        {getCategoryEmoji(course.category)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {course.instructor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className="course-category">{course.category}</span></td>
                  <td><span className={`level-badge level-${course.level}`}>{course.level}</span></td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{formatPrice(course.price)}</td>
                  <td>{course.enrollmentCount}</td>
                  <td>
                    <span className={`badge ${course.isPublished ? 'badge-green' : 'badge-gray'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(course)}>Edit</button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deleting === course._id}
                        onClick={() => handleDelete(course)}
                      >
                        {deleting === course._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editCourse ? '✏️ Edit Course' : '➕ New Course'}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Complete React Developer Course" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="What will students learn?" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Instructor *</label>
                    <input className="form-input" name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration *</label>
                    <input className="form-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 12 hours" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-select" name="level" value={form.level} onChange={handleChange}>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} min="0" placeholder="0 for free" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="react, javascript, web" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox" id="isPublished" name="isPublished"
                    checked={form.isPublished} onChange={handleChange}
                    style={{ width: 16, height: 16, accentColor: '#667eea', cursor: 'pointer' }}
                  />
                  <label htmlFor="isPublished" style={{ cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Publish immediately (visible to students)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
