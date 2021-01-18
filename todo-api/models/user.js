const utilService = new (require('../libs/util.service'))();

class User {
  static get tableName() {
    return 'users';
  }

  loginValidator(value) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!(value && value.email && value.password)) {
          return reject({ status: 401, message: 'Invalid User' });
        }
        const query = utilService.createGetQuery(['id', 'fname', 'lname', 'email'], value, User.tableName);
        const users = await global.connection.execute(query.query, query.values);
        if (users.length) {
          let user = {
            token: global.jwt.sign({
              id: users[0].id
            }, process.env.JWT_PASSWORD)
          };
          user = Object.assign(user, users[0]);
          return resolve(user);
        }
        return reject({ status: 401, message: 'Invalid User' });
      }
      catch (err) {
        return reject({ status: 500, message: 'Something went wrong!' });
      }
    });
  }
}

module.exports = User;