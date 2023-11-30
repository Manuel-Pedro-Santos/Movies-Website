import fetch from "node-fetch";
let serverUrl = "http://localhost:9200"
let headers = {
    "Content-Type": "application/json",
}

export async function createIndex(index){
    const response = await fetch(`${serverUrl}/${index}`, {
        method: "PUT",
        headers: headers
    })
    return await response.json()
}

export async function checkIndex(index){
    const response = await fetch(`${serverUrl}/${index}`,{
        method: "HEAD",
        headers: headers
    })
    return response.status === 200
}

export async function createDocument(index,body){
    const response = await fetch(`${serverUrl}/${index.toString()}/_doc/?refresh=wait_for`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })
    return await response.json()
}

export async function deleteDocumentByID(index,id){
    const response = await fetch(`${serverUrl}/${index.toString()}/_doc/${id.toString()}?refresh=wait_for`, {
        method: "DELETE",
        headers: headers
    })
    return await response.json()
}
export async function editField(index,id,field,value){
    let responseBody = {
        doc: {}
    }
    responseBody.doc[field] = value
    const response = await fetch(`${serverUrl}/${index.toString()}/_update/${id.toString()}?refresh=wait_for`,{
        method: "POST",
        headers:headers,
        body: JSON.stringify(responseBody)
    })
    return await response.json()
}
export async function getDocuments(index){//Necessitamos de uma query no body e um get não tem body por definição.
    let body = {
        'query': {
            'match_all' : {}
        }
    }
    const response = await fetch(`${serverUrl}/${index.toString()}/_search/`, {
        method: "POST",
        headers:headers,
        body: JSON.stringify(body)
    })
    let results = await response.json()
    results = results.hits.hits
    return processResults(results)
}

export async function getDocumentByID(index,id){
    const response = await fetch(`${serverUrl}/${index.toString()}/_doc/${id.toString()}`, {
        method: "GET",
        headers:headers
    })
    let results = await response.json()
    try{
        let returnObj = {
            id: results["_id"]
        }
        for(let prop in results["_source"]){
            returnObj[prop] = results["_source"][prop]
        }
        return returnObj
    }
    catch (e){
        return undefined
    }
}

function processResults(results){
    let returnArray = []
    for(let hit in results){
        let obj = {
            id: results[hit]["_id"]
        }
        for (let props in results[hit]["_source"]){
            obj[props] = results[hit]["_source"][props]
        }
        returnArray.push(obj)
    }
    return returnArray
}

export async function getDocumentByProperty(index, prop){
    let body = {
        query: {
            match: {
            }
        }
    }
    body.query.match[prop.name] = prop.value
    const response = await fetch(`${serverUrl}/${index.toString()}/_search`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })
    try {
        let results = await response.json()
        results = results.hits.hits
        return processResults(results)
    }
    catch (e){
        return undefined
    }

}
