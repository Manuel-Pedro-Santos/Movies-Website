import toHttpResponse from '../response-errors.mjs'


export default function(services) {

    return{
        getPopularMovies: getPopularMovies,
        getSearchMovies: getSearchMovies,
        createUser:createUser,
        createGroup:createGroup,
        editGroup:editGroup,
        listGroups:listGroups,
        deleteGroup:deleteGroup,
        getGroupDetails:getGroupDetails,
        addMovie:addMovie,
        deleteMovie:deleteMovie,
        getMovieDetails: getMovieDetails,
        getUser: getUser
    }

    async function getMovieDetails(req, rsp){
        try{
            const name = req.query["movie-name"]
            let body = await services.getMovieDetails(name)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function getUser(req, rsp){
        try{
            const user = req.params.user
            let body = await services.getUser(user)
            rsp.json(body)
        }
        catch (e){
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function deleteMovie(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            const movieID = req.params.movieID
            let body = await services.deleteMovie(name,id, token, movieID)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }


    async function addMovie(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            const movieID = req.body.id
            let body = await services.addMovie(name,id, token, movieID)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function getGroupDetails(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            let body = await services.getGroupDetails(name,id, token)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function deleteGroup(req, rsp){
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            let body = await services.deleteGroup(name,id, token)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function listGroups(req, rsp){
        try {
            const token = await getToken(req, rsp)
            let body = await services.listGroups(token)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function editGroup(req, rsp) {
        try {
            const token = await getToken(req, rsp)
            const name = req.query.name
            const id = req.query.id
            const newName = req.body.name
            const description = req.body.description
            let body = await services.editGroup(name,id , newName, description, token)
            rsp.json(body)
        } catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function getPopularMovies(req, rsp){
        try{
            let limit = req.query.limit
            let body = await services.getPopularMovies(limit)
            rsp.json(body)
        }catch (e){
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

    async function getSearchMovies(req, rsp) {
        try {
            const name = req.query["movie-name"]
            const limit = req.query.limit
            let body = await services.searchMovies(name, limit)
            rsp.json(body)
        }catch (e) {
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }
    
    async function createUser(req,rsp) {
        let body = await services.createToken()
        rsp.json(body)
    }

    async function createGroup(req,rsp) {
        try {
            const token = await getToken(req,rsp)
            const name = req.body.name
            const description = req.body.description
            let body = await services.createGroup(name, description, token)
            rsp.json(body)
        }catch (e){
            const response = toHttpResponse(e)
            rsp.status(response.status).json(response.body)
        }
    }

     async function getToken (req,rsp) {
        const bearer = "Bearer "
        const tokenHeader = req.get("Authorization")
        if(!(tokenHeader && tokenHeader.startsWith(bearer) && tokenHeader.length > bearer.length)) {
            rsp
                .status(401)
                .json({error: `Invalid authentication token`})
                return undefined

        }
        return tokenHeader.split(" ")[1]
    }
}