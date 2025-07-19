// Clear cache for specific class
const schoolId = '684ae7d2b7a71c0506c37389'
const classId = '685cba301cfedfe25bf3d35b'

// Clear localStorage cache
if (typeof window !== 'undefined') {
  localStorage.removeItem(`class:${schoolId}:${classId}`)
  localStorage.removeItem(`class:${schoolId}:${classId}:timestamp`)
  console.log('Cache cleared for class:', classId)
}

// Clear sessionStorage cache
if (typeof window !== 'undefined') {
  sessionStorage.removeItem(`school:${schoolId}:classes`)
  sessionStorage.removeItem(`school:${schoolId}:classes:timestamp`)
  console.log('Cache cleared for school:', schoolId)
}
