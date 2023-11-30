import toHttpResponse from '../response-errors.mjs'
import errors from "../../errors.mjs";
import url from "url";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export default function(services) {

    return{
        getHome:getHome,
        getCss:getCss,
        addMovieForm:addMovieForm,
        getPopularMovies: getPopularMovies,
        getSearchMovies: getSearchMovies,
        createGroup:createGroup,
        editGroup:editGroup,
        listGroups:listGroups,
        deleteGroup:deleteGroup,
        getGroupDetails:getGroupDetails,
        addMovie:addMovie,
        deleteMovie:deleteMovie,
        getMovieDetails:getMovieDetails,
        login:login,
        verifyUser: verifyUser,
        signup:signup,
        createUser:createUser,
        verifyAuthenticated: verifyAuthenticated,
        logout:logout,
    }

    async function login(req, rsp){
        rsp.render('login');
    }
    async function addMovie(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            let movieID = req.body.id
            if(movieID instanceof Array) movieID = req.body.title[0]
            await services.addMovie(name,id, token, movieID)
            rsp.redirect('/auth/group-details?name='+name+'&id='+id)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function deleteMovie(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            const movieID = req.params.movieID
            await services.deleteMovie(name,id, token, movieID)
            rsp.redirect('/auth/group-details?name='+name+'&id='+id)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }
    async function editGroup(req, rsp) {
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            let newName = req.body.name
            if(newName === ""){
                newName = name
            }
            const description = req.body.description
            await services.editGroup(name,id , newName, description, token)
            rsp.redirect('/auth/group-details?name='+newName+'&id=' + id)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }
    async function deleteGroup(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            await services.deleteGroup(name,id, token)
            rsp.redirect('/auth/list-groups')
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function listGroups(req, rsp){
        try {
            const token = await getToken(req, rsp)
            let groups = await services.listGroups(token)
            let body= {user:token, groups: groups}
            rsp.render('groups',body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function getGroupDetails(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            let body = await services.getGroupDetails(name,id, token)

            rsp.render('group', body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function createGroup(req,rsp) {
        try {
            const token = await getToken(req,rsp)
            const name = req.body.name
            const description = req.body.description
            await services.createGroup(name, description, token)
            rsp.redirect('/auth/list-groups')
        }catch (e){
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function getHome(req, rsp) {
        let body = {}
        if (await getToken(req, rsp) !== undefined) body.login = "Logout"; else body.login = "Login"
        rsp.render('home',body)
    }

    async function addMovieForm(req, rsp) {
        try {
            const token = await getToken(req, rsp)
            const movieId = req.query.movieId
            let groups = await services.listGroups(token)
            let body= {movieId:movieId, groups: groups}
            rsp.render('AddMovie',body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }


    async function getCss(req, rsp) {
        sendFile("site.css", rsp)
    }
    function sendFile(fileName, rsp) {
        const fileLocation = __dirname + 'views/' + fileName
        rsp.sendFile(fileLocation)
    }


    async function getPopularMovies(req, rsp){
        try{
            let limit = req.query.limit

            if(limit === '') {
                limit = undefined
            }

            let body = await services.getPopularMovies(limit)
            let movies = {movies:body}
            if(body) {
                if (await getToken(req, rsp) !== undefined) movies.login = "Logout"; else movies.login = "Login"
                rsp.render('movies', movies)
            }
        }catch (e){
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function verifyUser(req,rsp){
        try {
            let user = await services.getToken(req.body.username, req.body.pass)
            if(typeof user !== "undefined"){
                req.login (user, (err) => rsp.redirect('/auth/list-groups'))
            }
            rsp.render('login', {username: req.body.username, message: "Invalid username or password"})
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }


    }

    async function signup(req,rsp){
        rsp.render('signup')
    }

    async function createUser(req,rsp){
        try {
            let user = await services.createUser(req.body.username, req.body.pass)
            req.login(user, (err) => rsp.redirect('/auth/list-groups'))
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }

    async function getToken (req,rsp) {
        return req.user
    }

    async function getSearchMovies(req, rsp){
        try{
            const name = req.query["movie-name"]
            let limit = req.query.limit
            if (limit === '') {
                limit = undefined
            }

            let body = await services.searchMovies(name, limit)

            let movies = {movies:body}
            if (await getToken(req, rsp) !== undefined) movies.login = "Logout"; else movies.login = "Login"

            if(body) rsp.render('movies', movies)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.render('errors', response)
        }
    }
    async function getMovieDetails(req, rsp){
        try{
            const name = req.query["movie-name"]
            let body = await services.getMovieDetails(name)

            body.message = await getToken(req, rsp) !== undefined
            if(body.message) body.login = "Logout"; else body.login = "Login"
            if(body)
                rsp.render('movie', body)
        } catch (e) {
            const a = toHttpResponse(e)
            rsp.render('errors', a)
        }
    }

    async function verifyAuthenticated(req, rsp, next){
        if(req.user){
            return next()
        }
        rsp.redirect("/login")
    }

    async function logout(req,rsp){
        req.logout((err)=>rsp.redirect('/'))
    }
}