var sqlQuery = {
  get: {
    getUser: 'select * from category'
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