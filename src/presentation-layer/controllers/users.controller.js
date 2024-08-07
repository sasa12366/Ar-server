const UsersUseCase = require("../../domain-layer/use-cases/users.use-case");

exports.addUser = async (req, res) => {
  try {
    const usersUseCase = new UsersUseCase();
    const data = req.body;

    if (data) {
      const user = await usersUseCase.addOne(data);

      return res.status(200).send(user);
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

exports.getUser = async (req, res) => {
  try {
    const usersUseCase = new UsersUseCase();

    if (req?.query?.id) {
      const id = req.query.id;

      const user = await usersUseCase.getOne(id);
      return res.status(200).send(user);
    }

    const users = await usersUseCase.getAll();

    return res.status(200).send(users);
  } catch (e) {
    return res.status(400).send(e);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const usersUseCase = new UsersUseCase();
    const data = req.body;

    if (data?.phone_number) {
      const user = await usersUseCase.updateOne(data.phone_number, data.id);
      return res.status(200).send(user);
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
