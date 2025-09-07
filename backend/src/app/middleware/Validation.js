const helpers = require("../helpers");
// middlewares/validate.js
module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      return helpers.response(res, 400, false, error.details[0].message, {});
    }
    next();
  };
};
