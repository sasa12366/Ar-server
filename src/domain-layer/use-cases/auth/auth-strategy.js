const UsersUseCase = require("../users.use-case");

const authStrategy = {
  users: UsersUseCase,
};

module.exports = {
  authStrategy,
};