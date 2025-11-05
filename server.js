const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Разрешаем запросы с React
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// Проверка уникальности email
server.post('/users', (req, res, next) => {
  const users = router.db.get('users').value()
  const { email } = req.body
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' })
  }
  next()
})

server.use(router)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
