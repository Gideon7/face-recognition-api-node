const express = require('express');
const cors = require('cors')
const userController = require('./controllers/user.controller')
const app = express();
const PORT = 5000;

//express middleware json parser
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cors())
// app.use(bodyParser.json()) //deprecated 

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
app.post('/signin', (req, res) => {userController.signin(req,res)})
///register => post == new user object
app.post('/register',(req, res) => {userController.addUser(req,res)})

///profile/:userID => get == user object
app.get('/profile/:userID', (req,res) => {userController.getUserProfile(req,res)})

///image => put ==
app.put('/image', (req,res) => {userController.addEntries(req,res)})

app.post('/detectionUrl/', (req,res) => {userController.handleApiCall(req,res)})

app.listen(PORT, () => {
    console.log(`Listening to Port ${PORT}........`)
})   