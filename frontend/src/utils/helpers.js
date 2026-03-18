export const getCategoryEmoji = (category) => {
  const map = {
    'Web Development': '🌐',
    'Data Science': '📊',
    'Mobile Development': '📱',
    'DevOps': '⚙️',
    'Design': '🎨',
    'Machine Learning': '🤖',
    'Cybersecurity': '🔐',
    'Other': '📚'
  }
  return map[category] || '📚'
}

export const getCategoryGradient = (category) => {
  const map = {
    'Web Development': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Data Science': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Mobile Development': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'DevOps': 'linear-gradient(135deg, #fa8231 0%, #f7b731 100%)',
    'Design': 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
    'Machine Learning': 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    'Cybersecurity': 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
    'Other': 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)'
  }
  return map[category] || map['Other']
}

export const formatPrice = (price) => {
  if (price === 0) return 'Free'
  return `₹${price.toLocaleString('en-IN')}`
}

export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
