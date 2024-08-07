const knex = require("../../config/knex.config");
const OBJECTS_TABLE = "ar_objects";
const { DataBaseError, errors } = require("../utils/error.util");

module.exports = class ObjectsRepository {
    async getObjects() {
        try {
          const objects = await knex(OBJECTS_TABLE)
            .select(
              'id',
              'name',
              'added_date',
              'ar_marker',
              'content',
              'qr_code'
            );
      
          if (!objects.length) throw 'Нет данных';
      
          return objects;
        } catch (error) {
          throw error;
        }
      }
      
  async getOneObject(id) {
    try {
      const object = await knex(OBJECTS_TABLE)
        .select(
          'id',
          'name',
          'added_date',
          'ar_marker',
          'content',
          'qr_code'
        )
        .where({ id });
  
      if (!object[0]) throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
      return object[0];
    } catch (error) {
      throw error;
    }
  }

  async addObject(fields) {
  const trx = await knex.transaction({ isolation: 'repeatable read' });

  try {
    const result = await knex(OBJECTS_TABLE)
      .transacting(trx)
      .insert(fields)
      .returning('id');

    await trx.commit();

    return result;
  } catch (error) {
    await trx.rollback();
    throw 'Ошибка атомарности ' + error;
  }
};


async removeOneObject(id) {
    try {
      const result = await knex(OBJECTS_TABLE)
        .del()
        .where({ id })
        .returning('id');
  
      if (!result[0])   throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
  
      return { id: result[0] };
    } catch (error) {
      throw error;
    }
  }
  

  async updateOneObject(id, fields) {
    try {
      const result = await knex(OBJECTS_TABLE)
        .where({ id }) 
        .update({ ...fields})
        .returning('*');
  
      if (!result[0].id) {
        throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
      }
  
      const updatedObject = await knex(OBJECTS_TABLE)
        .select(
          'id',
          'name',
          'added_date',
          'ar_marker',
          'content',
          'qr_code'
        )
        .where({ id: result[0].id });
  
      if (!updatedObject[0]) {
        throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
      }
  
      return updatedObject[0];
    } catch (error) {
      throw new DataBaseError(errors.get("DATA_BASE_ERROR"));
    }
  }
  

}