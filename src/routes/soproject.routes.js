const {Router} = require("express");
const connection = require("../../database/database");
const bcryptjs  = require("bcryptjs");
const router = Router();

router.get("/", (req, res) => {
    res.render("index", {login: false, name: "Debe Iniciar Sesion"})
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/registro", (req, res) => {
    res.render("register");
});

router.post("/register", async(req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;

    let passEncry = await bcryptjs.hash(pass, 8);

    let query = `CALL ADM_SP_USUARIOS_CREAR("${user}", "${name}", "${passEncry}")`;

    connection.query(query, async(error, results) =>{
        error ? 
        console.log(error) : 
        res.redirect("/");
    });
});

router.post("/auth", async(req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    let passEncry = await bcryptjs.hash(pass, 8);

    if(user && pass){
        let query = `SELECT * FROM adm_ta_usuarios WHERE VC_USERNAME = '${user}'`;

        connection.query(query, async(error, results) =>{
            // if(results.length > 0 || !(await bcryptjs.compare(passEncry, results[0].VC_CONTRASENA))){

            // }else{
            //     req.session.loggedIn = true;
            //     res.redirect("/");
            // }
            console.log(error);
            console.log(results);
            if(await bcryptjs.compare(passEncry, results[0].VC_CONTRASENA)) {
                req.session.loggedIn = true;
                res.redirect("/");
            }
        });
    }
});

router.get("/", (req, res) => {
    if(req.session.loggedIn) res.render("index", {login: true, name: req.session.username});
    else res.render("index", {login: false, name: "Debe Iniciar Sesion"})
});

module.exports = router;
