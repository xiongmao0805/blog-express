var sqlQuery = {
  get: {
    getAllUser: 'select * from category',
    getUserByName: function (username){
      return `select * from users where username=${'username'}`;
    },

  },
  post: {
    register: function (params) {
      var keys = [], values = [];
      for (key in params) {
        if (params[key]) {
          keys.push(key);
          values.push(`"${params[key]}"`);
        }
      }
      return `insert into users (${keys.join(',')}) values (${values.join(',')})`;
    }
  }
}

module.exports = sqlQuery;