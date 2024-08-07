const ObjectsUseCase = require("../../domain-layer/use-cases/objects.use-case");

exports.getObjects = async (req, res) => {
  const objectsUseCase = new ObjectsUseCase();
  try {
    if (req?.query?.id) {
      const id = req.query.id;
      const object = await objectsUseCase.getOneObject(id);

      return res.status(200).send(object);
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const objects = await objectsUseCase.getObjects();

    return res.status(200).send(objects);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.addObject = async (req, res) => {
  try {
    const objectsUseCase = new ObjectsUseCase();
    const data = req.body;

    if (data) {
      const object = await objectsUseCase.addObject(data);

      return res.status(200).send(object);
    } else {
      return res.status(400).send("Нет данных для добавления");
    }
  } catch (error) {
    return res.status(400).send("Ошибка добавления объекта: " + error);
  }
};

exports.removeObject = async (req, res) => {
  if (req?.query?.id) {
      const id = req.query.id;

      try {
          const objectsUseCase = new ObjectsUseCase();
          const object = await objectsUseCase.removeObject(id);
  
          return res.status(200).send(object);
      } catch (error) {
          return res.status(400).send(error);
      }
  } else {
      return res.status(400).send("ID объекта не предоставлен");
  }
};

exports.updateObject = async (req, res) => {
  try {
      const objectsUseCase = new ObjectsUseCase();
      const data = req.body;

      if (data) {
          const object = await objectsUseCase.updateObject(data);

          return res.status(200).send(object);
      } else {
          return res.status(400).send("Данные для обновления не предоставлены");
      }
  } catch (error) {
      return res.status(400).send(error);
  }
};

