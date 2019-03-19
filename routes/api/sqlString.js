function initParams(params) {
  var keys = [], values = [];
  for (key in params) {
    if (params[key]) {
      keys.push(key);
      values.push(`"${params[key]}"`);
    }
  }
  return { keys: keys, vals: values };
}
var sqlQuery = {
  get: {
    getAllUser: 'select * from category',
    getUserByName: function (username) {
      return `select * from users where username='${username}'`;
    },
  },
  post: {
    login: function (params) {
      return `select * from users where username='${username}' and password='${params.password}'`;
    },
    register: function (params) {
      params = initParams(params);
      var keys = params.keys, vals = params.vals;
      return `insert into users (${keys.join(',')}) values (${vals.join(',')})`;
    },
    update: function (sheet, params) {

    }
  }
}

module.exports = sqlQuery;