import errors from '../errors.mjs'
import {getFilmById} from "../data/cmdb-movies-data.mjs";

export default function(movieData, dataMem) {

    if (!movieData) {
        throw errors.INVALID_PARAMETER('movieData')
    }
    if (!dataMem) {
        throw errors.INVALID_PARAMETER('dataMem')
    }
    return {
        getPopularMovies: getPopularMovies,
        searchMovies: searchMovies,
        createToken: createToken,
        getToken: getToken,
        createUser: createUser,
        createGroup: createGroup,
        editGroup: editGroup,
        listGroups: listGroups,
        deleteGroup: deleteGroup,
        getGroupDetails: getGroupDetails,
        addMovie: addMovie,
        deleteMovie: deleteMovie,
        getMovieDetails: getMovieDetails
    }

    async function getPopularMovies(limit) {
        if((!Number(limit) && !(typeof limit === "undefined"))||limit>250){
            throw errors.BAD_LIMIT()
        }
        else if(Number(limit)){
            limit = Number(limit)
        }
        else{
            limit = 250
        }
        return await movieData.getPopularMovies(limit)
    }

    async function getToken(username, pass){
        if(typeof(username) === "undefined"){
            throw errors.INVALID_PARAMETER(username)
        }
        if(typeof(pass) === "undefined"){
            throw errors.INVALID_PARAMETER(pass)
        }
        return await dataMem.checkUser(username,pass)
    }

    async function createUser(username, pass){
        if(typeof(username) === "undefined"){
            throw errors.INVALID_PARAMETER(user)
        }
        if(typeof(pass) === "undefined"){
            throw errors.INVALID_PARAMETER(pass)
        }
        return await dataMem.createUser(username, pass)
    }


    async function searchMovies(name, limit) {
        if((!Number(limit) && !(typeof limit === "undefined")) || limit>250){
            throw errors.BAD_LIMIT()
        }

        return await movieData.searchByName(name, Number(limit))
    }

    async function createToken() {
        return dataMem.createToken()
    }

    async function createGroup(group, description, uuid) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        await dataMem.addGroup(group, description, uuid)
        return "Group successfully created"
    }

    async function editGroup(name, id, newName, description, uuid) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        if(typeof(id) !== "undefined"){
            if(!(await dataMem.checkGroupByID(id,uuid))) throw errors.GROUP_NOT_FOUND()
            await dataMem.editGroup(id,{name: newName,description: description},uuid)
            return "Group successfully edited"
        }
        const groups = await dataMem.checkGroupByName(name,uuid)
        if(typeof(groups) === "undefined") throw errors.GROUP_NOT_FOUND()
        if(groups.length > 1) throw errors.MORE_THAN_ONE_GROUP_WITH_NAME(groups)
        await dataMem.editGroup(groups[0].id,{name: newName, description: description},uuid)
        return "Group successfully edited"
    }

    async function listGroups(uuid) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()

        return dataMem.listGroups(uuid)
    }

    async function deleteGroup(name,id, uuid) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        if(typeof(id) !== "undefined" && id !== ""){
            if(!(await dataMem.checkGroupByID(id,uuid))) throw errors.GROUP_NOT_FOUND
            await dataMem.deleteGroup(id,uuid)
            return "Successfully deleted the group"
        }
        const groups = await dataMem.checkGroupByName(name,uuid)
        if(typeof(groups) === "undefined") throw errors.GROUP_NOT_FOUND()
        if(groups.length > 1) throw errors.MORE_THAN_ONE_GROUP_WITH_NAME(groups)
        await dataMem.deleteGroup(groups[0].id,uuid)
        return "Successfully deleted the group"
    }

    async function getGroupDetails(name, id, uuid) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        if(typeof(id) !== "undefined" && id !== ""){
            if(!(await dataMem.checkGroupByID(id,uuid))) throw errors.GROUP_NOT_FOUND
            return await dataMem.getGroupDetails(id,uuid)
        }
        const groups = await dataMem.checkGroupByName(name,uuid)
        if(groups.length === 0) throw errors.GROUP_NOT_FOUND()
        if(groups.length > 1) throw errors.MORE_THAN_ONE_GROUP_WITH_NAME(groups)
        return await dataMem.getGroupDetails(groups[0].id,uuid)
    }


    async function addMovie(name,id, uuid, movieID) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        if(typeof(id) !== "undefined"&& id !== ""){
            if(!(await dataMem.checkGroupByID(id,uuid))) throw errors.GROUP_NOT_FOUND
            let movie = await getFilmById(movieID)
            await dataMem.addMovie(movie,id,uuid)
            return "Successfully added the movie"
        }
        const groups = await dataMem.checkGroupByName(name,uuid)
        if(typeof(groups) === "undefined") throw errors.GROUP_NOT_FOUND()
        if(groups.length > 1) throw errors.MORE_THAN_ONE_GROUP_WITH_NAME(groups)
        let movie = await getFilmById(movieID)
        await dataMem.addMovie(movie,groups[0].id,uuid)
        return "Successfully added the movie"
    }

    async function deleteMovie(name,id, uuid, movieID) {
        if (!(await dataMem.checkToken(uuid))) throw errors.USER_NOT_FOUND()
        if(typeof(id) !== "undefined" && id !== ""){
            if(!(await dataMem.checkGroupByID(id,uuid))) throw errors.GROUP_NOT_FOUND
            await dataMem.deleteMovie(movieID,id,uuid)
            return "Successfully deleted the movie"
        }
        const groups = await dataMem.checkGroupByName(name,uuid)
        if(typeof(groups) === "undefined" && id !== "") throw errors.GROUP_NOT_FOUND()
        if(groups.length > 1) throw errors.MORE_THAN_ONE_GROUP_WITH_NAME(groups)
        await dataMem.deleteMovie(movieID,groups[0].id,uuid)
        return "Successfully deleted the movie"
    }

    async function getMovieDetails(name) {
        if (typeof (name) === "undefined") {
            throw errors.INVALID_PARAMETER(name)
        }
        let details = await movieData.getMovieDetails(name)
        if (details.id == null) {
            throw errors.MOVIE_NOT_FOUND
        }
        return details
    }
}
