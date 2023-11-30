import {
    createIndex,
    checkIndex,
    createDocument, 
    deleteDocumentByID, 
    editField,
    getDocumentByID,
    getDocumentByProperty,
    getDocuments
} from "./elasticSearch-client.mjs"

import {randomUUID} from "node:crypto"

export async function onStartUp(){
    if(!await checkIndex("logins")){
        await createIndex("logins")
    }
}

export async function createUser(username, pass){
    let token = await createToken()
    let body = {
        username: username,
        pass: pass,
        id: token
    }
    await createDocument("logins",body)
    return token
}

export async function createToken(){
    let token = randomUUID().toString().replaceAll("-","")
    await createIndex(token)
    return token
}

export async function checkUser(username, pass){
    let users = await getDocumentByProperty("logins", {name: "username", value: `${username}`})
    for(let user in users){
        if(users[user].pass === pass){
            return users[user].id
        }
    }
}

export async function checkToken(uuid){
    return await(checkIndex(uuid))
}

export async function addGroup(name,description,uuid){
    let body = {
        name: name,
        "movie-array": [],
        description: description,
        "total-duration": 0
    }
    await createDocument(uuid,body)
}

export async function editGroup(id,properties,uuid){
    for(let prop in properties){
        await editField(uuid,id,prop,properties[prop])
    }
}


export async function checkGroupByName(name,uuid){
    return (await getDocumentByProperty(uuid,{name: "name", value: `${name}`}))
}

export async function checkGroupByID(id,uuid){
    return await (await getDocumentByID(uuid,id)) !== undefined

}

export async function deleteGroup(id, uuid){
    return await deleteDocumentByID(uuid,id)
}

export async function listGroups(uuid){
    return await getDocuments(uuid)
}

export async function getGroupDetails(id,uuid){
    return await getDocumentByID(uuid,id)
}

export async function addMovie(movie,id,uuid){
    let movieArray = (await getDocumentByID(uuid,id))["movie-array"]
    movieArray.push(movie)
    await editField(uuid,id,"movie-array",movieArray)
    let total = (await getDocumentByID(uuid,id))["total-duration"]
    total = total + movie.duration
    await editField(uuid,id,"total-duration",total)
}

export async function deleteMovie(movie,id,uuid){
    let doc = (await getDocumentByID(uuid,id))
    let movieArray = doc["movie-array"]
    let duration = 0
    for(let element in movieArray){
        if(movieArray[element].id === movie){
            duration = movieArray[element].duration
            movieArray.splice(Number(element),1)
        }
    }
    duration = doc["total-duration"] - duration
    await editField(uuid,id,"movie-array",movieArray)
    await editField(uuid,id,"total-duration", duration)
}
