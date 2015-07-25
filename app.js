var fs = require('fs');
function DB(db, filename) {
    Object.defineProperty(db, "save", {enumerable: false, value: save.bind(db,filename)});
    return db;
}
function save(filename) {
    fs.writeFileSync(filename, JSON.stringify(this));
}
module.exports = function (filename) {
    if (fs.existsSync(filename)) {
        return DB(JSON.parse(fs.readFileSync(filename)),filename);
    }
    return DB({}, filename);
};