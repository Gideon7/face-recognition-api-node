const mongoose = require('mongoose');
const { resolve } = require('path');

const glob = require('glob');


async const connectToDatabase = () => {
    try {
        await mongoose.connect(
            APP_DB_URI,
            {
                autoIndex: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        ).then(data => {
            if (data){
                console.log("Database Connection Successful")
            }
        }).then(err => {
            console.log(`[Database Connection Error] ${err}`)
        })
    } catch (error) {
        console.log(`DB Error: ${e.message}`);
    }
}

const loadModels = () => {
    const basePath = resolve(__dirname, '../models/');
    const files = glob.sync('*.js', { cwd: basePath });
    files.forEach((file) => {
        if (file.toLocaleLowerCase().includes('_config')) return;
        // eslint-disable-next-line
        require(resolve(basePath, file));
    });
}


module.exports = {
    connectToDatabase,
    loadModels,
};