const knex = require("../../config/knex.config");
const USERS_TABLE = "users";
const { DataBaseError, errors } = require("../utils/error.util");

module.exports = class UserRepository {
  async addUser(fields) {
    try {
      const result = await knex(USERS_TABLE).insert(fields).returning("*");

      if (!result[0]) {
        return null;
      }

      return result[0];
    } catch (error) {
      throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
    }
  }

  async getAllUsers() {
    try {
      const users = await knex(USERS_TABLE);
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getOneUser(phone_number) {
    try {
      const user = await knex
        .select("id", "username", "phone_number", "password")
        .from(USERS_TABLE)
        .where({ phone_number });

      if (!user[0]) {
        return null;
      }

      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async updateOneUser(phone_number, id) {
    try {
      const user = await knex(USERS_TABLE)
        .where({ id: id })
        .update({ phone_number: phone_number }, ["id", "username", "phone_number"]);

      return user;
    } catch (error) {
      throw error;
    }
  }
};
