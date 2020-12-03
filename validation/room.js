const Validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateRoomInput(data) {
  let errors = {};

  data.title = validText(data.title) ? data.title : '';


  if (Validator.isEmpty(data.title)) {
    errors.text = 'Title field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};