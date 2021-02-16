const fs = require('fs');
const path = require('path');
const db = require('../db/db.json');

module.exports = function (app) {

    function addDatabase (notes){
        notes = JSON.stringify(notes);
        fs.writeFileSync('./db/db.json', notes, function(err) {
            if (err) throw (err);
        });
    }

    app.get('/api/notes', function (req, res) {
        res.json(db);
    });

    app.post('/api/notes', function (req, res) {
        if (db.length == 0) {
            req.body.id = '0';
        } else {
            req.body.id = JSON.stringify(JSON.parse(db[db.length - 1].id) + 1);
        }

        db.push(req.body);
        addDatabase(db);
        res.json(req.body);
    });

    app.delete("/api/notes/:id", function(req, res){ 
        let id = req.params.id.toString();
        console.log(id);

        for (i=0; i < db.length; i++){
            if (db[i].id == id){

                res.send(db[i]);

                db.splice(i,1);
                break;
            }
        }
        addDatabase(db);
    });

    app.get("/notes", function (req, res){
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    app.get("/", function (req, res){
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

};