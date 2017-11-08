/**
 * Created by reiven on 2017/11/07.
 */
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB_URI);

var tags = new mongoose.Schema({
    id: Schema.Types.ObjectId,
    tagName: String, // img url
    noteId: [],
    createdAt: {type: Date, default: Date.now }//TODO: need to check. same as Model/Note.js
});


mongoose.connect(process.env.DB_URL);

module.exports = mongoose.model("Tags", tags);