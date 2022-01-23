const {Router} = require("express");
const connection = require("../../database/database");
const router = Router();

// router.get("/", (req, res) => {
//     res.render("index", {login: false, name: "Debe Iniciar Sesion"})
// });

router.get("/login", (req, res) => {
    res.render("login", {message: null});
});

router.get("/registro", (req, res) => {
    res.render("register");
});

router.post("/register", async(req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;

    let query = `CALL ADM_SP_USUARIOS_CREAR("${user}", "${name}", "${pass}")`;

    connection.query(query, async(error, results) =>{
        error ? 
        console.log(error) : 
        res.redirect("/");
    });
});

router.post("/auth", async(req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    if(user && pass){
        let query = `SELECT * FROM adm_ta_usuarios WHERE VC_USERNAME LIKE '${user}'`;

        connection.query(query, async(error, results) =>{
            if(results.length == 0){
                req.session.loggedIn = false;
                res.render("login", {message: "USUARIO NO ENCONTRADO"});
            }
            else if(pass != results[0]["VC_CONTRASENA"]){
                req.session.loggedIn = false;
                res.render("login", {message: "CONTRASEÑA INCORRECTA"});
            }
            else{
                req.session.loggedIn = true;
                req.session.username = results[0]["VC_USERNAME"];
                res.redirect("/");
            }
        });
    }
});

router.get("/", (req, res) => {
    if(req.session.loggedIn) res.render("index", {login: true, name: req.session.username});
    else res.render("index", {login: false, name: "Debe Iniciar Sesion"})
});

//función para limpiar la caché luego del logout
router.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
router.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
})

router.get("/emitir/:id", (req, res) => {
    res.render("visualizar");
});

router.get("/emitir", (req, res) => {
    res.render("user_view");
});

router.get("/finalizada", (req, res) => {
    res.render("finalizada");
});

module.exports = router;
