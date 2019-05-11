let express = require('express');
let {error, success, checkAndChange} = require('./functions/functions');
let bodyParser = require('body-parser');
let config = require('./config/config');
let mysql = require('promise-mysql');

const app = express();

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {

    console.log('Connected !!!');


    let MembersRouter = express.Router();

    Members = require("./models/members")(db, config);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));

    MembersRouter.route('/:id')

        //Recupere un membre avec son id
        .get( async (req, res) => {
            let member = await Members.getByID(req.params.id);
            res.json(checkAndChange(member)) ;
        })

        //Modifier un membre avec son id
        .put( async (req, res) => {

            let updateMembers = await Members.update(req.params.id, req.body.name);
            res.json(checkAndChange(updateMembers))

        })

        //supprimer un membre avec son id
        .delete( async (req, res) =>{

            let deleteMember = await Members.delete(req.params.id);
            res.json(checkAndChange(deleteMember))
        });

    MembersRouter.route("/")

        //recuper tous les membre
        .get( async (req,res)=>{
            let allMembers = await Members.getAll(req.query.max);
            res.json(checkAndChange(allMembers));

        })

        //ajouter un membre
        .post( async (req, res) => {
            let addMember = await Members.add(req.body.name);
            res.json(checkAndChange(addMember))
        });


    app.use(config.rootAPI + 'members', MembersRouter);


    app.listen(config.port, () => {
        console.log("server on listen http://localhost:"+config.port)
    });

}).catch((err) => {
    console.log("Error during Database connection!!!");
    console.log(err.message)
});
/*
function getIndex(id) {
    for (let i =0; i < members.length; i++){
        if (members[i].id == id )
            return i
    }

    return "Wrong id"
}

function createId() {
    return members[members.length - 1].id + 1
}

*/


/*
//un middleware est un programe qui va s'executer avant tout
//sur l'url
app.use((req, res, next) => {
    console.log('URL : ' + req.url)
    next()
});


app.get('/api', (req, res) => {
    res.send('Root Api')
});

app.get('/api/v1', (req, res)=> {
    res.send("API version 1")
});

app.get('/api/v1/book/:id/:id2', (req, res) => {
    res.send(req.params)
} );
*/

