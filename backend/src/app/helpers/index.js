const moment = require("moment");

let helpers = {};

helpers.response = (
  res,
  code = "200",
  status = false,
  message = null,
  data = {}
) => {
  res.status(code).send({ status: status, message: message, data: data });
};

/**
 * Format the date and time
 */
helpers.formatDateTime = (data) => {
  return moment(data).format("DD-MM-YYYY HH:mm A");
};

/**
 * Make the first Character in Upper Case.
 */
helpers.capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = helpers;
