const createDB = () => {
  const db = new Map()
  db.set('users', [])
  db.set('hobbies', [])
  return db
}

const db = createDB()
export { db }