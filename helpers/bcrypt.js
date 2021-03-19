const bcrypt = require("bcryptjs");

const hash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const compare = (pw, hash) => {
  return bcrypt.compareSync(pw, hash);
};

module.exports = {
  hash,
  compare,
};
