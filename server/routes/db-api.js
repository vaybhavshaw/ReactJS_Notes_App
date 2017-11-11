var express = require('express');
var router = express.Router();
const checkJwt = require('../auth').checkJwt;
const fetch = require('node-fetch');
var ObjectId = require('mongoose').Types.ObjectId;
// api trigger for generating dummy meaningless demo data,
// router.get("/generate-data", checkJwt, function(req, res, next){
//     var generateDemo = require("../util/generate_demodata");
//     generateDemo();
//     res.send("");
// });

// send user data in every login time.
router.post('/user-info', checkJwt, function(req, res, next){
    // var generateDemo = require("../util/generate_demodata");
    //     generateDemo();
    // console.log("connectStatus: ",req.body.name, req.body.nickname, req.body.picture);
    var User = require("../model/User");
    User.find({name: req.body.name, nickname: req.body.nickname, img: req.body.picture}).then(
        function(result){
            if(result.length == 0){
                console.log("there is no data. Time to add data!");
                var user = new User();
                user.name = req.body.name;
                user.nickname = req.body.nickname;
                user.img = req.body.picture;
                user.save(function(err){
                    if(err){
                        res.send({"result": false, "content": "error occur while saving data"});
                    }
                })
            }else{
                console.log("there is data already.");
            }
            res.send({"result": true, "content": "done correclty"});
        }
    ).catch(function(err){
        console.log("something wrong happen: ", err);
        res.send({"result": false});
    });
});// END: router.get('/all-note', checkJwt, function(req, res, next)


// get api to show all note in main panel.
router.post('/all-note', checkJwt, function(req, res, next){
    var getContent = require("../util/getContent");
    var userExist = require("../util/checkUserExist");
    userExist(req.body).then(function(result){
        if(result){// user exist
            getContent("all", result.toString()).then(
                function(result){
                    console.log("check data before send: ", result);
                    res.send(result);
                }
            ).catch(function(err){
                console.log("something wrong:" + err);
                res.send("wrong flg");
            });
        }else{
            res.send("wrong flg");
        }
    });
});// END: router.get('/all-note', checkJwt, function(req, res, next)

// get api to show share note in main panel.
router.post('/share-note', checkJwt, function(req, res, next){
    var getContent = require("../util/getContent");
    var userExist = require("../util/checkUserExist");
    userExist(req.body).then(function(result){
        if(result){// user exist
            getContent("share", result.toString()).then(
                function(result){
                    res.send(result);
                }
            ).catch(function(err){
                console.log("something wrong:" + err);
                res.send("wrong flg");
            });
        }else{
            res.send("wrong flg");
        }
    });
});// END: router.get('/share-note', checkJwt, function(req, res, next)

// get api to show my note in main panel.
router.post('/my-note', checkJwt, function(req, res, next){
    var getContent = require("../util/getContent");
    var userExist = require("../util/checkUserExist");
    userExist(req.body).then(function(result){
        if(result){// user exist
            getContent("my", result.toString()).then(
                function(result){
                    res.send(result);
                }
            ).catch(function(err){
                console.log("something wrong:" + err);
                res.send("wrong flg");
            });
        }else{
            res.send("wrong flg");
        }
    });
});// END: router.get('/my-note', checkJwt, function(req, res, next)

router.post('/add-note', checkJwt, function(req, res, next){
    var title = req.body.noteTitle;
    var content = req.body.noteDesc;
    var tags = req.body.tags;
    tags = tags.split(", ").map(function(b){
        return b.substr(1);
    });
    var share = !req.body.private;
    var type = req.body.noteType;
    var shareUser = req.body.shared;
    shareUser = shareUser.split(", ").map(function(b){
        return b
    });
    // console.log("Sharing with: ");
    // console.log(shareUser);
    var shareUserIdList = [];
    var userId = req.body.userID;
    var lastEditId = req.body.userID;
    var mode = req.body.mode;
    var theme = req.body.theme;
    var auto = req.body.autoComplete;
    var line = req.body.lineNumber;

    var Tag = require("../model/Tag");
    var User = require("../model/User");
    var tagPromise = Promise.resolve(Tag.find());
    var userPromise = Promise.resolve(User.find());
    Promise.all([tagPromise, userPromise]).then(
        function(result){
            var tagList = result[0];
            var userList = result[1];
            //console.log("tagList: ",tagList);
            //console.log("userList: ",userList);
            function findTagByTagName(tagName){
                var result = tagList.filter(function(tagObject){
                    var result = false;
                    if(tagObject.tagName.indexOf(tagName) != -1){
                        result = true;
                    }
                    return result;
                });
                if(result.length > 0){
                    result = result[0];
                }else{
                    result = {_id: undefined};
                }
                return result;
            }

            function findUserByUserName(userName){
                var result = userList.filter(function(userObject){
                    var result = false;
                    if(userObject.name.indexOf(userName) != -1){
                        result = true;
                    }
                    return result;
                });

                if(result.length > 0){
                    result = result[0];
                }else{
                    result = {};
                    result._id = undefined;
                }
                return result;
            }

            function findUserByNickName(userName){
                var result = userList.filter(function(userObject){
                    var result = false;
                    if(userObject.nickname.indexOf(userName) != -1){
                        result = true;
                    }
                    return result;
                });
                if(result.length > 0){
                    result = result[0];
                }else{
                    result = {};
                    result._id = undefined;
                }
                return result;
            }

            function getTagIdList(tagList){
                var result = [];
                for(var i = 0; i < tagList.length; i++){
                    result.push({tagName: tagList[i], saveState: getTagId(tagList[i])});
                }
                var newIds = saveNewTag(result);
                result = result.filter(o => o.saveState !== null);
                result = result.concat(newIds);
                return result;
            }

            var isSet = require("../util/isSet");

            function getTagId(tagName){
                return isSet(findTagByTagName(tagName)._id, null);
            }

            var tagsIdList = getTagIdList(tags);
            function saveNewTag(tagsIdList){
                var newIds = [];
                var newPromise = []
                for(var i = 0; i < tagsIdList.length; i++){
                    var tag = new Tag();
                    if(tagsIdList[i].saveState == null){
                        newIds.push({tagName: tagsIdList[i].tagName, saveState: tag._id});
                        tag.tagName = tagsIdList[i].tagName;
                        tag.save(function(err){});
                    }
                }
                return newIds;
            }

            var tagSaveList = tagsIdList.map(function(col){
                return col.saveState;
            });

            userId = findUserByUserName(userId)._id;
            shareUser.forEach(element =>{
                shareUserIdList.push({userId: findUserByNickName(element)._id, r: true, w: false});
            });
            console.log(tagsIdList);
            console.log(userId);
            console.log(shareUserIdList);
            var newNoteId = addNote(tagSaveList, shareUserIdList, title, content, share, type, mode, theme, auto, line, userId, userId);
            
            for(var i = 0; i < tagSaveList.length; i ++){
                Tag.update({"_id": ObjectId(tagSaveList[i])}, { $push: { noteId: newNoteId } }, function(err){
                    if(err){
                        console.log("Something gone wrong");
                        console.log(err);
                    }else{
                        console.log("Success!!");
                    }
                });
            }
        });

});

function addNote(tagsList, shareUserList, title, content, share, type, mode, theme, autoComplete, lineNumber, userId, lastEdit){
    const Note = require("../model/Note");
    var note = new Note();
    note.userId = userId;
    note.finalEditUserId = lastEdit;
    note.title = title;
    note.content = content;
    note.description = "save data from api call";
    note.tags = tagsList;
    note.share = share;
    note.shareUser = shareUserList;
    // note.like = likeUserList;
    // note.dislike = dislikeUserList;
    note.type = type;
    note.codeSetting.mode = mode; // example codeSetting
    note.codeSetting.theme = theme; // example codeSetting
    note.codeSetting.autoComplete = autoComplete; //default is false, so change true
    note.codeSetting.lineNumber = lineNumber;  //default is false, so change true
    note.save(function(err){
        if(err){
            console.log("something else");
            console.log(err);
        }else{
            console.log("save all note data correctly");
        }
    });
    return note._id;
}

module.exports = router;
