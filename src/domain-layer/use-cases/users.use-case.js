const UserRepository = require("../../data-layer/users.repository");
const User = require("../entities/user.entity");
const { PropertyRequiredError, errors } = require("../../utils/error.util");
const HandlerUseCase = require("./common/handler.use-case");

module.exports = class UserUseCase extends HandlerUseCase {
  constructor() {
    const mapFields = {
      id: "id",
      username: "username",
      phone_number: "phone_number",
      password: "password",
    };
    super(mapFields);
  }

  async addOne(payload) {
    const fields = payload.data["fields"];

    if (!fields || !fields.length || !Array.isArray(fields)) {
      throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
    }

    const isStringChecked = this.checkStringFieldsInsert(fields);

    if (!isStringChecked) {
      throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
    }

    try {
      const userRepository = new UserRepository();
      const data = await userRepository.addUser(this.reduceFields(fields));

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const userRepository = new UserRepository();
      const users = await userRepository.getAllUsers();
      const mappedUsers = users.map((el) => new User(el));

      return mappedUsers;
    } catch (error) {
      throw error;
    }
  }

  async getOne(email) {
    try {
      const userRepository = new UserRepository();
      const userData = await userRepository.getOneUser(email);

      if (!userData) {
        return null;
      }

      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  async updateOne(email, id) {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.updateOneUser(email, id);
      return new User(user);
    } catch (error) {
      throw error;
    }
  }
};
