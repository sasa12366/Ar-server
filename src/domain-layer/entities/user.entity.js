module.exports = class User {
    constructor(user) {
      this.user = {
        id: user.id,
        username: user.name,
        phone_number: user.phone_number,
        password: user.password,
      };
  
      return this.user;
    }
  };
  