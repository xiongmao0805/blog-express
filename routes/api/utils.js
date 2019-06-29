var formatParams = function (params) {
  var keys = [], values = [];
  for (key in params) {
    if (params[key]) {
      keys.push(key);
      values.push(`"${params[key]}"`);
    }
  }
  return { keys: keys, vals: values };
}

module.exports = {
  formatParams,
}