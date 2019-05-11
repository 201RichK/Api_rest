//Modules
let express = require('express');
let bodyParser = require('body-parser');
let twig = require("twig");
let axios = require('axios');

//Variables globales
const app = express();
const port = 81;
const fetch = axios.create({
    baseURL: "http://localhost/api/v1/"
});



//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


//Routes
app.get('/members', (req, res) => {
    //res.sendFile(__dirname+"/views/index.twig")
   // res.render(__dirname+"/views/index.twig")

    fetch.get("members/")
        .then(response =>  {
            if (response.data.status === "Success") {
                res.render("members.twig", {
                    members: response.data.result
                });
            }else{
                renderMsg(res, response.data.message)
            }
        })
        .catch(error => { renderMsg(res, error.message)})

});




//lencement de l'application
app.listen(port, () => console.log("stated on port http://localhost:" + port ));


//Functions
function renderMsg(res, errMsg) {
    res.render("err.twig", {
        errMsg: errMsg
    })
}