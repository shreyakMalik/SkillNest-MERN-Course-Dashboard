import { useAuth } from '../../context/AuthContext'

export default function Toast() {
  const { toast } = useAuth()
  if (!toast) return null

  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? '✓' : '✕'}
      </span>
      <span>{toast.message}</span>
    </div>
  )
}
