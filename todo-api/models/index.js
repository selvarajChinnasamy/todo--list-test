const mysql = require('mysql'),
    env = process.env.DEV_ENV || 'development',
    config = require(`../config/environments/${env}`),
    fs = require('fs'),
    path = require('path');

global.connection = {
    execute: undefined
};

const db = {};

try {
    global.connection.execute = function (sql, value) {
        return new Promise((resolve, reject) => {
            try {
                const connection = mysql.createConnection(config.db);
                connection.query(sql, value, function (err, result) {
                    if (err) return reject(err);
                    return resolve(result);
                });
            }
            catch (err) {
                return reject("Something went wrong!");
            }
        });
    };
    console.log('DB connection established');
} catch (err) {
    console.log(err);
    throw Error(err);
}

fs.readdirSync(__dirname).filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js')).forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
});

module.exports = db;