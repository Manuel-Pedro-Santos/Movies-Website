
import  fetch  from 'node-fetch'

const APIKey = 'k_wh413or9'

//Processed movies in the top250 by name, id, and duration
export async function getPopularMovies(limit) {
    let returnObject
    await fetch(`https://imdb-api.com/en/API/Top250Movies/${APIKey}`)
        .then(res => res.json())
        .then(data => {returnObject = processResults(data.items)})
        .catch(err => `An error occurred ${err} `)
    for(let i = 0 ; i < 250 - limit; i++){
        returnObject.pop()
    }
    return returnObject
 }

export async function getMovieDetails(name){
    let rawDetails
    let id = (await searchByName(name, 1))[0].id
    await fetch(`https://imdb-api.com/en/API/Title/${APIKey}/${id}`)
        .then(res => res.json())
        .then(data => {rawDetails = data})
        .catch(err => `An error occurred ${err}`)
    return parseDetails(rawDetails, id)
}

function parseDetails(rawDetails, id){
    let returnObject = {
        id: id,
        title: rawDetails.fullTitle,
        description: rawDetails.plot,
        image_url: rawDetails.image,
        runtimeMins: parseInt(rawDetails.runtimeMins),
        directors: rawDetails.directors,
        actors: []
    }
    for(let actor in rawDetails.actorList){
        returnObject.actors.push(rawDetails.actorList[actor].name)
    }
    return returnObject
}
 //Search for a movie outside the top250 and
export async function searchByName(name, limit){
    let returnObject
    await fetch(`https://imdb-api.com/en/API/SearchMovie/${APIKey}/${name}`)
        .then(res => res.json())
        .then(data => {returnObject = processResults(data.results)})
        .catch(err => `An error occurred ${err}`)
    if(returnObject.length > limit){
        const size = returnObject.length
        for(let i = 0 ; i < size - limit; i++){
            returnObject.pop()
        }
    }
    return returnObject
 }
export async function getFilmById(id){
    let movieInfo = {}
    await fetch(`https://imdb-api.com/en/API/Title/${APIKey}/${id}`)
        .then(res => res.json())
        .then(obj => {
            movieInfo.id = obj.id
            movieInfo.title = obj.title
            movieInfo.duration = parseInt(obj.runtimeMins)
            }
        )
        .catch(err => `An error occurred ${err} `)
    return movieInfo

 }
 

function processResults(obj) {
    let returnObject = []
    for(let data of obj){
        let movie = {}
        movie.id = data.id
        movie.title = data.title
        returnObject.push(movie)
    }
    return returnObject
 }

//console.log(await getFilmById("tt1016150"))