const express = require('express');
const cors = require('cors')
const app = express();
const bcrypt = require('bcrypt')
const db = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'TestDB'
    }
  });

const PORT = 5000;

//express middleware json parser
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cors())
// app.use(bodyParser.json()) //deprecated 

db.select('*').from('users').then(data => {
    console.log(data)
})



//middleware request/response handler
app.use((req,res,next) => {
    const start = Date.now();
    next(); 
    const delta = Date.now() - start; 
    console.log(`${req.method} ${req.url} ${delta}ms`)
  
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'TEMPLATE TEST',
        caption: 'lets go to the farm'
    })
})
//sigin => post == success/fail
app.post('/signin', (req, res) => {
    let found = false
  database.users.forEach(user => {
      if (req.body.email === user.email){
          found = true
          res.status(200).json('Success')
      }
  })
  if (!found){
    res.status(404).json('User Not Found')
  }
})

///register => post == new user object
app.post('/register', (req,res) => {
    //grab body from request and push to database
    const {name, email, password} = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        createdDate: new Date().toISOString()
    }).then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json("unable to add to database"))

})

///profile/:userID => get == user object
app.get('/profile/:userID', (req, res) => {
    const { userID } = req.params;
    let found = false
    database.users.forEach(user => {
        if (userID === user.id){
            found = true
            return res.status(200).json(user)
        }
    })
    if (!found){
        res.status(404).json('Not Found')
    }
})

///image => put ==
app.put('/image', (req,res) => {
    const { userID } = req.body;
    let found = false
    database.users.forEach(user => {
        if (userID === user.id){
            found = true
            user.entries++
            return res.status(200).json(user.entries)
        }
    })
    if (!found){
        res.status(404).json('Not Found')
    }
})

app.listen(PORT, () => { 
    console.log(`Listening to Port ${PORT}........`)
})   