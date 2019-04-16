const express = require('express')
const app = express()

const Sequelize = require('sequelize')
// const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres', {define: { timestamps: false }})
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})

// // If we add the first API endpoint:
// app.get('/houses', function (req, res, next) {
//   res.json({ message: 'Read all houses' })
// })

// And some code to listen to port 4000:
const port = 4000
app.listen(port, () => `Listening on port ${port}`)

// This is how you setup the house model in Sequelize (read more in the docs)
const House = sequelize.define('house', {
  title: Sequelize.STRING,
  address: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
  tableName: 'houses'
})

House.sync() // this creates the houses table in your database when your app starts

// If we combine the Sequelize findAll method with our previously tested app.get we get the following:
app.get('/houses', function (req, res, next) {
  House.findAll()
  .then(houses => {
    res.json({ houses: houses })
  })
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err
    })
  })
})

app.get('/houses/:id', function (req, res, next) {
  const id = req.params.id
  House.findByPk(id)
  .then(houses => {
    res.json({ houses })
  })
})

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.post('/houses', function (req, res) {
  console.log('Incoming data: ', req.body)
  res.json({ message: 'Create a new house' })
})

//////// create
app.post('/houses', function (req, res) {
  House
    .create(req.body)
    .then(house => res.status(201).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong posting your new house',
        error: err
      })
    })
})

House.create({
  title: 'Multi Million Estate',
  address: 'This was built by a super-duper rich programmer',
  size: 1235,
  price: 98400000
}).then(house => console.log(`The house is now created. The ID = ${house.id}`))


//// adjust
// app.put('/houses/:id', function (req, res) {
//   const id = req.params.id
//   res.json({ message: `Update house ${id}` })
// })

app.put('/houses/:id', function (req, res, next) {
  const id = req.params.id
 House.findByPk(id)
 .then(house => 
  house.update({
    'title': 'Super fsfasddsf Million Dollar Mainson'
  }))
  .then(house => res.status(201).json(`The house with ID ${house.id} is now updated`,))
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong updating your new house',
      error: err
    })
    res.send()
  })
 
})

// app.get('/houses/:id', function (req, res, next) {
//   const id = req.params.id
//   House.findByPk(id)
//   .then(houses => {
//     res.json({ houses })
//   })
// })

app.delete('/houses/:id', function (req, res, next) {
  const id = req.params.id
  House.destroy({ where : { id }})
  .then(() => console.log(`The house with ID ${id} is now deleted`))
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong destroying your new house',
      error: err
    })
    res.send()
  })
})
