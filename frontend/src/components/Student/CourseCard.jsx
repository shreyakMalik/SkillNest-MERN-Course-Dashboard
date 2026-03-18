import { getCategoryEmoji, getCategoryGradient, formatPrice } from '../../utils/helpers'

export default function CourseCard({ course, isEnrolled, onEnroll, enrolling }) {
  return (
    <div className="course-card">
      <div
        className="course-card-header"
        style={{ background: getCategoryGradient(course.category) }}
      >
        <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
          {getCategoryEmoji(course.category)}
        </span>
        {!course.isPublished && (
          <span
            style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.5)', color: '#fa8231',
              fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: 6, letterSpacing: 1
            }}
          >
            Draft
          </span>
        )}
      </div>

      <div className="course-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <span className="course-category">{course.category}</span>
          <span className={`level-badge level-${course.level}`}>{course.level}</span>
        </div>

        <h3 className="course-title">{course.title}</h3>

        <p className="course-instructor">
          <span>👤</span> {course.instructor}
        </p>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
          {course.description.length > 90
            ? course.description.slice(0, 90) + '…'
            : course.description}
        </p>

        <div className="course-meta">
          <span className="meta-tag">⏱ {course.duration}</span>
          <span className="meta-tag">⭐ {course.rating > 0 ? course.rating.toFixed(1) : 'New'}</span>
          <span className="meta-tag">👥 {course.enrollmentCount} enrolled</span>
        </div>
      </div>

      <div className="course-card-footer">
        <span className={`course-price ${course.price === 0 ? 'free' : ''}`}>
          {formatPrice(course.price)}
        </span>

        {isEnrolled ? (
          <span className="badge-enrolled">✓ Enrolled</span>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onEnroll && onEnroll(course._id, course.title)}
            disabled={enrolling === course._id}
          >
            {enrolling === course._id ? '...' : 'Enroll Now'}
          </button>
        )}
      </div>
    </div>
  )
}
