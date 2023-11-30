import {readFile, writeFile} from "fs/promises"
import {existsSync} from "fs"
import {randomUUID} from "node:crypto"


export async function onStartUp(){
    if(!existsSync("storage.json")){
        let baseFile = {
            users: {

            },
            logins: {

            }
        }
        await writeToStorage(baseFile)
        return false
    }
    return true
}

export async function writeToStorage(object){
    let json = JSON.stringify(object,undefined,"    ")
    await writeFile("storage.json",json,function (error){
        if(error){
            return error
        }
    })
    return true
}

export async function readFromStorage(){
    let storage = await readFile("storage.json", "utf-8")
    return JSON.parse(storage)
}

export async function createToken(){
    let uuid = randomUUID()
    let storage = await readFromStorage()
    storage.users[uuid] = {
        groups: []
    }
    await writeToStorage(storage)
    return uuid
}

export async function checkToken(uuid){
    let storage = await readFromStorage()
    return storage.users.hasOwnProperty(uuid)
}
export async function createUser(username, pass){
    let token = await createToken()
    let storage = await readFromStorage()
    storage.logins[username] = {
        pass: pass,
        token: token
    }
    await writeToStorage(storage)
    return token
}

export async function checkUser(username, pass){
    let storage = await readFromStorage()
    let user = storage.logins[username]
    let token = undefined
    if(user.pass === pass){
        token = user.token
    }
    return token
}

export async function addGroup(name,description,uuid){
    let storage = await readFromStorage()
    let id = randomUUID()
    storage.users[uuid].groups.push({
        id:id,
        name: name,
        "movie-array": [],
        description: description,
        "total-duration": 0
    })
    await writeToStorage(storage)
    return id
}

export async function checkGroupByName(name,uuid){
    let storage = await readFromStorage()
    return storage.users[uuid].groups.filter(group => group.name === name)

}

export async function checkGroupByID(id, uuid){
    let storage = await readFromStorage()
    return storage.users[uuid].groups.some(group => group.id === id)
}

export async function editGroup(id, properties, uuid){
    let storage = await readFromStorage()
    let group = storage.users[uuid].groups.filter(group => group.id === id)[0]
    for(let prop in properties){
        group[prop] = properties[prop]
    }
    await deleteGroup(id, uuid)
    storage = await readFromStorage()
    storage.users[uuid].groups.push(group)
    await writeToStorage(storage)
}

export async function deleteGroup(id, uuid){
    let storage = await readFromStorage()
    for(let group in storage.users[uuid].groups){
        if(storage.users[uuid].groups[group].id === id){
            storage.users[uuid].groups.splice(Number(group), 1)
        }
    }
    await writeToStorage(storage)
}

export async function listGroups(uuid){
    let groups = []
    let storage = await readFromStorage()
    for(let group in storage.users[uuid].groups){
        groups.push(await getGroupDetails(storage.users[uuid].groups[group].id,uuid))
    }
    return groups
}

export async function getGroupDetails(id,uuid){
    let storage = await readFromStorage()
    let details = {}
    let instance = storage.users[uuid].groups.filter(group => group.id === id)[0]
    details["id"] = instance.id
    details["name"] = instance.name
    details["description"] = instance.description
    details["movie-array"] = instance["movie-array"]
    details["total-duration"] = instance["total-duration"]
    return details
}

export async function addMovie(movie,id,uuid){
    let storage = await readFromStorage()
    let group = storage.users[uuid].groups.filter(group => group.id === id)[0]
    group["movie-array"].push(movie)
    group["total-duration"] = group["total-duration"] + movie.duration
    await deleteGroup(id, uuid)
    storage = await readFromStorage()
    storage.users[uuid].groups.push(group)
    await writeToStorage(storage)
}

export async function deleteMovie(movieID,id,uuid){
    let storage = await readFromStorage()
    let group = storage.users[uuid].groups.filter(group => group.id === id)[0]

    for(let movie in group["movie-array"]){
        if(group["movie-array"][movie].id === movieID){
            group["movie-array"].splice(Number(movie),1)
        }
    }
    await deleteGroup(id,uuid)
    storage = await readFromStorage()
    storage.users[uuid].groups.push(group)
    await writeToStorage(storage)
}