const bcrypt = require('bcrypt')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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

const addUser = (req,res) => {
    //grab body from request and push to database
    const saltRounds = 10;
    const {name, email, password} = req.body;
    if (!name || !email || !password){
       return res.status(400).json("Fill Up Empty Textfields")
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    createdDate: new Date().toISOString()
                }).then(user => {
                    res.json(user[0])
                })
        })
        .then(trx.commit)
        .then(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to add to database"))

}

const signin = (req, res) => {
    const {email, password} = req.body
    if (!email || !password){
        return res.status(400).json("Fill Up Empty Textfields")
     }
    db.select('email', 'hash').from('login')
         .where('email', '=', email)
         .then(data => {
             const isValid = bcrypt.compareSync(password, data[0].hash)
             if (isValid){
                return db.select('*').from('users')
                     .where('email', '=', email)
                     .then(user => {
                         res.status(200).json(user[0])
                     })
                     .catch(err => res.status(400).json("unable to get user"))
             }else{
                  res.status(400).json("Wrong credentials")
             }
         })
         .catch(err => res.status(400).json("Wrong credentials"))
 }

 const getUserProfile = (req, res) => {
    const { userID } = req.params;
    db.select('*').from('users')
    .where({id: userID})
    .then(user => {
        if (user.length){
            res.json(user[0])
        }else{
            res.status(400).json('User Not Found')
        }
    })
    .catch(err => res.status(400).json('Database disrupt error'))
    
}

const addEntries = (req,res) => {
    const { id } = req.body;
    console.log('id',id)
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            console.log(entries)
            return res.status(200).json(entries[0])
        })
        .catch(err => res.status(400).json("unable to fetch database record and update it"));
}

const handleApiCall = (req, res) => {
    const reqBody = req.body
    console.log('body: ', reqBody)
    const raw = JSON.stringify({
        "user_app_id": {
          "user_id": "dqxfhjtprube",
          "app_id": "e1ae4e7329f4445492f9ce03f49c12b3"
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": req.body.imageUrl
              }
            }
          }
        ]
      });
      
    const requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Key 1950b40831d2490698c7643aafd8b6cd'
        },
        body: raw
      };
      fetch("https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs", requestOptions)
      .then(response => {
          return res.status(200).json(response);
        })
      .catch(error => console.log('error', error));
}

module.exports = {
    addUser,
    signin,
    getUserProfile,
    addEntries,
    handleApiCall,
}
