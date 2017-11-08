/**
 * Created by reiven on 2017/11/07.
 */

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB_URI);

var note = new mongoose.Schema({
    id: Schema.Types.ObjectId,
    content: String,// main content of note
    title: String,// content title
    tags: [Schema.Types.ObjectId],
    share: {type: Boolean, default: false}, // if enable to share, set true, else this note could not share
    shareUser: [{// TODO: not checked yet. item added in share user's schema is below.
        userId: {type: Schema.Types.ObjectId},
        r: {type: Boolean, default: true},// read authority, if true, note can read only, else, note can't see whether share flag is true, default is true.
        w: {type: Boolean, default: false}// write authority, if true, note can edit, else note cannot edit, default: false
    }],
    description: String,// description
    type: {type: String, default: "note"},// put note type: [note | code], default: note
    codeSetting: {
        mode: {type: String},
        theme: {type: String},
        autoComplete: {type: Boolean, default: false},
        lineNumber: {type: Boolean, default: false},
    },
    like: [// TODO: not checked yet.
        {
            userId: {type: Schema.Types.ObjectId},
            createdAt: {type: Date, default: Date.now}
        }
    ],
    dislike: [// TODO: not checked yet.
        {
            userId: {type: Schema.Types.ObjectId},
            createdAt: {type: Date, default: Date.now}
        }
    ]
}, {timestamps: {}});// timestamp automatically set createdAt, and updatedAt

module.exports = mongoose.model("Note", note);