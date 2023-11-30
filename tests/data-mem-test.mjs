import assert from 'node:assert/strict'
import * as data from "../data/cmdb-data-mem.mjs"
import * as fs from "fs";

describe('Validate data-mem module test', function () {
    describe('#onStartup tests', function () {
        it('should return false', async function () {
            if(fs.existsSync("storage.json")){
                fs.unlinkSync("storage.json")
            }
            assert.equal(await data.onStartUp(),false)
        });
        it('should return true', async function () {
            if(!fs.existsSync("storage.json")){
                await data.writeToStorage({})
            }
            assert.equal(await data.onStartUp(),true)
        });
    });
    describe('#writeToStorage & #readFromStorage tests',  function () {
        it('should have file containing object', async function () {
            if(fs.existsSync("storage.json")){
                fs.unlinkSync("storage.json")
            }
            await data.writeToStorage({benfica: "é o maior"})
            let obj = await data.readFromStorage()
            assert.equal(obj.hasOwnProperty("benfica"), true)
            assert.equal(obj.benfica, "é o maior")
        });
    });
    describe('#addUser & #checkUser tests', function () {
        it('should return true ', async function () {
            if(fs.existsSync("storage.json")){
                fs.unlinkSync("storage.json")
            }
            await data.onStartUp()
            let uuid = await data.createToken()
            assert.equal(await data.checkUser(uuid), true)
        });
    });
    describe('group tests', async function () {
        describe('#addGroup & #checkGroupByName tests', function () {
            it('should return true', async function () {
                if(fs.existsSync("storage.json")){
                    fs.unlinkSync("storage.json")
                }
                await data.onStartUp()
                let uuid = await data.createToken()
                await data.addGroup("benfica","é o maior", uuid)
                assert.equal((await data.checkGroupByName("benfica",uuid)).some(it => it.name === "benfica"),true)
                assert.equal((await data.checkGroupByName("benfica",uuid)).some(it => it.description === "é o maior"),true)
            });
        });
        describe('#deleteGroup test', function () {
            it('should return false', async function () {
                if(fs.existsSync("storage.json")){
                    fs.unlinkSync("storage.json")
                }
                await data.onStartUp()
                let uuid = await data.createToken()
                let id = await data.addGroup("benfica","é o maior", uuid)
                await data.deleteGroup(id,uuid)
                assert.equal((await data.checkGroupByName("benfica",uuid)).some(it => it.name === "benfica"), false)
                assert.equal((await data.checkGroupByName("benfica",uuid)).some(it => it.description === "é o maior"),false)
            });
        });
        describe('#listGroups test', function () {
            it('should return correct list of groups', async function () {
                if(fs.existsSync("storage.json")){
                    fs.unlinkSync("storage.json")
                }
                await data.onStartUp()
                let uuid = await data.createToken()
                await data.addGroup("benfica","é o maior", uuid)
                await data.addGroup("taças","do benfica", uuid)
                await data.addGroup("campeonatos","que o benfica tem", uuid)
                let groups = await data.listGroups(uuid)
                assert.equal(groups.length, 3)
                assert.equal(groups.some(it => it.name === "benfica"),true)
                assert.equal(groups.some(it => it.name === "taças"),true)
                assert.equal(groups.some(it => it.name === "campeonatos"),true)
                assert.equal(groups.some(it => it.description === "é o maior"), true)
                assert.equal(groups.some(it => it.description ===  "do benfica"), true)
                assert.equal(groups.some(it => it.description ===  "que o benfica tem"), true)
            });
        });
        describe('#getGroupDetails', function () {
            it('should return group details', async function () {
                if(fs.existsSync("storage.json")){
                    fs.unlinkSync("storage.json")
                }
                await data.onStartUp()
                let uuid = await data.createToken()
                let id = await data.addGroup("benfica","é o maior", uuid)
                let details = await data.getGroupDetails(id,uuid)
                assert.equal(details.name,"benfica")
                assert.equal(details.description, "é o maior")
                assert.deepEqual(details.movies, [])
                assert.equal(details["total-duration"],0)
            });

        });
    });

    describe('#addMovie test', function () {
        it('should add movie with correct info', async function () {
            if(fs.existsSync("storage.json")){
                fs.unlinkSync("storage.json")
            }
            await data.onStartUp()
            let movie = {
                name: "Benfica",
                id: "Campeão",
                duration: 999999
            }
            let uuid = await data.createToken()
            let id = await data.addGroup("recordações","as melhores recordações do benfica",uuid)
            await data.addMovie(movie,id,uuid)
            let storage = await data.readFromStorage()
            assert.equal(storage.users[uuid].groups[0].name === "recordações",true)
            assert.equal(storage.users[uuid].groups[0].description, "as melhores recordações do benfica")
            let movies = storage.users[uuid].groups[0]["movie-array"]
            assert.equal(movies[0].name,movie.name)
            assert.equal(movies[0].id,movie.id)
            assert.equal(movies[0].duration,movie.duration)
        });
    });
});