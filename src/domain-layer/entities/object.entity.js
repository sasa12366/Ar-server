module.exports = class Object {
    object;
    
    constructor(object) {
        this.object = {
            id: object.id,
            name: object.name,
            added_date: object.added_date,
            ar_marker: object.ar_marker,
            content: object.content,
            qr_code: object.qr_code
        }

        return this.object
    }

    get object() {
        return this.object
    }
}