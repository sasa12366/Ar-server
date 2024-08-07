const ObjectRepository = require("../../data-layer/objects.repository.js");
const Object1 = require("../entities/object.entity.js");

const { PropertyRequiredError, errors } = require("../../utils/error.util"); 

module.exports = class ObjectUseCase {

  mapFields = {
    id: "id",
    name: "name",
    added_date: "added_date",
    ar_marker: "ar_marker",
    content: "content",
    qr_code: "qr_code"
  }

  async getObjects() {
    const objectRepository = new ObjectRepository();

    try {
      const objectsDb = await objectRepository.getObjects();
      const objects =objectsDb.map((objectDb) => new Object1(objectDb));

      return objects;
    } catch (error) {
      throw error;
    }
  }

  async getOneObject(id) {
    const objectRepository = new ObjectRepository();

    try {
      const objectDb = await objectRepository.getOneObject(id);
      const object = new Object1(objectDb);

      return object;
    } catch (error) {
      throw error;
    }
  }

  async addObject(data) {
      const objectRepository = new ObjectRepository();
  
      if (!data.fields || !Array.isArray(data.fields) || !data.fields.length) {
        throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
      };
  
      const fields = data.fields;
      const isStringChecked = this.checkStringFieldsInsert(fields);
  
      if (!isStringChecked) {
        throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
      }
  
      try {
          const object = await objectRepository.addObject(this.reduceFields(fields));
  
          return object
      } catch (error) {
          throw error;
      }
    }
  
    async removeObject(id) {
      try {
        const objectRepository = new ObjectRepository();
        const result = await objectRepository.removeOneObject(id);
    
        return result;
      } catch (error) {
        throw error;
      }
    }

    async updateObject(data) {
      const objectRepository = new ObjectRepository();
    
      if (!data.fields || !Array.isArray(data.fields) || !data.fields.length) {
        throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
      }
    
      const elWithId = data.fields.find(el => el.id);
    
      if (!elWithId) {
        throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
      }
    
      const fields = data.fields;
      const isStringChecked = this.checkStringFields(fields);
    
      if (!isStringChecked) {
        throw new PropertyRequiredError(errors.get("NO_PROPERTY"));
      }
    
      try {
        const updatedObject = await objectRepository.updateOneObject(elWithId.id, this.reduceFields(fields));
        const object = new Object(updatedObject);
    
        return object;
      } catch (error) {
        throw error;
      }
    }
    

  checkStringFieldsInsert(fields) {
    const keys = fields.map(val => {
        return Object.entries(val)[0][0];
    });

    const IS_VALID = true;

    for (let i = 0; i < keys.length; i++) {
        if (!(keys[i]) in this.mapFields) return !IS_VALID;
    }

    return IS_VALID;
};

checkStringFields(fields) {
    const IS_VALID = true;
    const fieldsNormalized = fields
      .map(el => Object.entries(el)[0][0]);

      fieldsNormalized.some(([key, _]) => {
          if (!this.mapFields[key]) {
              return !IS_VALID
          };
      });

      return IS_VALID;
}

reduceFields(fields) {
    return fields.reduce((acc, el) => {
        const entriesEl = Object.entries(el);
        acc[entriesEl[0][0]] = entriesEl[0][1]

        return acc;
    }, {})
  

  };
};