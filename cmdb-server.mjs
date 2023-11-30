import express from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from "cors"
import yaml from "yamljs"
import hbs from 'hbs'
import url from 'url'
import path from 'path'
import passport from 'passport'
import expressSession from 'express-session'
import * as movieData from "./data/cmdb-movies-data.mjs"
import * as dataMem from "./data/cmdb-db.mjs"//ESTA COM O ELASTIC SEARCH
import initServices from "./services/cmdb-services.mjs"
import initAPI from "./web/api/cmdb-web-api.mjs"
import initSite from "./web/site/cmdb-web-site.mjs"

await dataMem.onStartUp()
const services = initServices(movieData,dataMem)
const api = initAPI(services)
const site = initSite(services)
const openapiDocs = yaml.load("./docs/cmdb-api-spec.yaml")
const PORT = 8080
export let app = express()

app.use(express.json())
app.use(cors())

app.use(express.urlencoded( { extended: false}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocs))
app.use(expressSession({
    secret: "A Joana é fixe",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.session())
app.use(passport.initialize())

passport.serializeUser(serializeUserDeserializeUser)
passport.deserializeUser(serializeUserDeserializeUser)

function serializeUserDeserializeUser(user,done){
    done(null,user)
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'web', 'site', 'views'));
app.use("/auth",site.verifyAuthenticated)

app.get("/", site.getHome)
app.get("/login", site.login)
app.post("/login", site.verifyUser)
app.get("/signup",site.signup)
app.post("/signup",site.createUser)
app.get("/logout",site.logout)
app.get("/auth/site.css", site.getCss)
app.get("/site.css", site.getCss)
app.get("/search-movies", site.getSearchMovies)
app.get("/movie", site.getMovieDetails)
app.get("/popular-movies", site.getPopularMovies)
app.get("/auth/add-movie", site.addMovieForm)
app.get("/auth/group-details", site.getGroupDetails)
app.post("/auth/edit-group", site.editGroup)
app.post("/auth/group",site.createGroup)
app.get("/auth/list-groups", site.listGroups)
app.post("/auth/delete-group", site.deleteGroup)
app.post("/auth/add-movie", site.addMovie)
app.post("/auth/delete-movie/:movieID", site.deleteMovie)

app.get("/popular-movies", api.getPopularMovies)
app.get("/search-movies", api.getSearchMovies)
app.get("/user", api.createUser)
app.post("/group",api.createGroup)
app.post("/edit-group", api.editGroup) //TODO add empty new name and description verifications. They cannot both be empty
app.get("/list-groups", api.listGroups)
app.delete("/group", api.deleteGroup)
app.get("/group-details", api.getGroupDetails)
app.post("/add-movie", api.addMovie)
app.delete("/delete-movie/:movieID", api.deleteMovie)
app.get("/movie", api.getMovieDetails)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
