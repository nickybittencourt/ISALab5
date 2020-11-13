const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const path = require('path');

app.post('/api/definitions/', urlencodedParser, function (req, res) {
    
    let entry = { 

        word: req.body['word'],
        definition: req.body['definition'], 
    };

    fs.readFile('dictionary.json', function (err, data) {
        
        if (err) throw err;
        
        var parseJson = JSON.parse(data);

        let shouldAdd = true;

        parseJson.forEach( element => {
            
            if (element.word == entry.word) {

                res.send("Entry already exists!")
                shouldAdd = false;
            }
        });

        if (shouldAdd) {

            parseJson.push(entry)
  
            fs.writeFile('dictionary.json', JSON.stringify(parseJson, null, 3), function (err) {
            
                if (err) throw err;
            
                res.send("Entry successfully added!")
            })
        }
    })
});

router.get('/api/definitions', function(req,res){
  
    let rawdata = fs.readFileSync('dictionary.json');
    let dictionary = JSON.parse(rawdata);
    
    res.send(dictionary);
});

app.get("/api/definitions/:word", (req, res, next) => {
    
    let rawdata = fs.readFileSync('dictionary.json');
    let dictionary = JSON.parse(rawdata);

    entry = dictionary.find(element => {
        
        if (element.word.toLowerCase() == req.params.word.toLowerCase()) {
            return element
        }
    })

    if (entry != undefined) {
        
        res.send(entry)

    } else {
        res.status(404).send('Entry not found!')
    }

});

app.get("/api/definitions/*", (req, res, next) => {
    
    let rawdata = fs.readFileSync('dictionary.json');
    let word = req.query.word
    let dictionary = JSON.parse(rawdata);

    entry = dictionary.find(element => {
        
        if (element.word.toLowerCase() == word.toLowerCase()) {
            return element
        }
    })

    res.render(path.join(__dirname, '/search.ejs'), { entry: entry })

});

app.get('/api/search', function (req, res) {

    let word = { 

        word: "",
        definition: "", 
    };
    
    res.render(path.join(__dirname, '/search.ejs'), {entry: word})
})

app.use(express.static('./'));

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/', router);
app.listen(PORT);