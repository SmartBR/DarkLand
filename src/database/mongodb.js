const mongoose = require("mongoose")
const config = require("../../resource/config.json")

mongoose.connect(config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("Conectado ao MongoDB."))

module.exports = mongoose