import assert from 'node:assert/strict'
import fs from "fs";
import * as movieData from "../data/cmdb-movies-data.mjs";
import servicesInit from "../services/cmdb-services.mjs";
import * as dataMem from "../data/cmdb-data-mem.mjs";
import errors from "../errors.mjs";

describe('Validate service module', function () {

    const services = servicesInit(movieData,dataMem)

    describe('#getPopularMovies test', function () {
        it('should return of length 50', async function () {
            let array = await services.getPopularMovies(50)
            assert.equal(array.length,50)
        });
        it('should return of length 250', async function () {
            let array = await services.getPopularMovies()
            assert.equal(array.length,250)
        });
    });

    describe('#searchMovies',function (){
        it('should not return empty array', async function () {
            let array = await services.searchMovies("Inception",50)
            assert.notEqual(array.length,0)
        });
    });

    describe('#createUser tests', function () {
        if(fs.existsSync("storage.json")){
            fs.unlinkSync("storage.json")
        }
        it('should return true ', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            assert.equal(await dataMem.checkUser(uuid), true)
        });
    });

    describe('#createGroup', async function(){
        if(fs.existsSync("storage.json")){
            fs.unlinkSync("storage.json")
        }
        it('should return true', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            let group = await services.createGroup("benfica","é o maior", uuid)
            assert.equal(group,true)
        });

       it('should throw USER_NOT_FOUND', async function () {

           await dataMem.onStartUp()
            let uuid = undefined
           try {
               await services.createGroup("benfica","é o maior", uuid)
           }catch (e) {
               assert.equal(e ,errors.USER_NOT_FOUND)
           }
        });
    });

    describe('#addMovie', function (){

        if (fs.existsSync("storage.json")) {
            fs.unlinkSync("storage.json")
        }
        it('should throw USER_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            try {
                await services.addMovie("benfica", undefined,"tt1375666")
            }catch (e) {
                assert.equal(e, errors.USER_NOT_FOUND)
            }
        });
        it('should throw GROUP_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            try {
                await services.addMovie(undefined, uuid, "tt1375666")
            }catch (e) {
                assert.equal(e, errors.GROUP_NOT_FOUND)
            }
        });

        it('should throw MOVIE_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica","é o maior", uuid)
            try {
                await services.addMovie("benfica", uuid, "t1375666")
            }catch (e) {
                assert.equal(e, errors.MOVIE_NOT_FOUND)
            }

        });
        it('should return movie', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica","é o maior", uuid)
            const movie = await services.addMovie("benfica", uuid, "tt1375666")
            assert.equal(movie.id, "tt1375666")
        });
        it('should throw MOVIE_ALREADY_IN_GROUP', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica","é o maior", uuid)
            await services.addMovie("benfica", uuid, "tt1375666")
            try {
                await services.addMovie("benfica", uuid, "tt1375666")
            }catch (e) {
                assert.equal(e, errors.MOVIE_ALREADY_IN_GROUP)
            }

        });

    });

    describe('#getGroupDetails', function () {
        if (fs.existsSync("storage.json")) {
            fs.unlinkSync("storage.json")
        }
        it('should throw USER_NOT_FOUND', async function () {
            await dataMem.onStartUp()
            try {
                await services.getGroupDetails("benfica", undefined)
            }catch (e) {
                assert.equal(e, errors.USER_NOT_FOUND)
            }
        });
        it('should throw GROUP_NOT_FOUND', async function () {
            await dataMem.onStartUp()
            let uuid = await services.createUser()
            try {
                await services.getGroupDetails("benfica", uuid)
            }catch (e) {
                assert.equal(e, errors.GROUP_NOT_FOUND)
            }
        });

        it('should return group', async function () {
            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maior", uuid)
            await services.addMovie("benfica",uuid,"tt1375666")
            const group = await services.getGroupDetails("benfica", uuid)

            assert.equal(group.name,"benfica")
            assert.equal(group.description,"é o maior")
            assert.equal(group.movies.length,1)
        });

    });

    describe('#editGroup',async function () {
        if (fs.existsSync("storage.json")) {
            fs.unlinkSync("storage.json")
        }
        it('should throw USER_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            try {
                await services.editGroup("benfica", "slb", undefined)
            }catch (e) {
                assert.equal(e,errors.USER_NOT_FOUND)
            }


        });
        it('should throw GROUP_NOT_FOUND', async function () {

            await dataMem.onStartUp()

            let uuid = await services.createUser()
            try {
                await services.editGroup(undefined, "slb", uuid)
            }
            catch (e) {
                assert.equal(e,errors.GROUP_NOT_FOUND)
            }
        });

        it('should return the group', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maior", uuid)
            await services.addMovie("benfica",uuid,"tt1375666")
            await services.editGroup("benfica", "slb", uuid)
            const group = await services.getGroupDetails("benfica",uuid)

            assert.equal(group.name,"benfica")
            assert.equal(group.description,"slb")
            assert.equal(group.movies.length,1)
        });
    });

    describe('#listGroups', function () {
        if (fs.existsSync("storage.json")) {
            fs.unlinkSync("storage.json")
        }
        it('should throw USER_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            try {
                await services.listGroups(undefined)
            }catch (e) {
                assert.equal(e,errors.USER_NOT_FOUND)
            }
        });
        it('should return empty array', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            let list = await services.listGroups(uuid)
            assert.equal(list.length,0)
        });
        it('should not return empty array', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maior",uuid)
            await services.createGroup("slb", "benfica",uuid)

            let list = await services.listGroups(uuid)
            assert.equal(list.length,2)
        });
    });

    describe('#deleteGroup', function () {
        it('should throw USER_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            try {
                await services.deleteGroup("benfica", undefined)
            }catch (e) {
                assert.equal(e,errors.USER_NOT_FOUND)
            }
        });
        it('should throw GROUP_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            try {
                await services.deleteGroup("benfica", uuid)
            }catch (e) {
                assert.equal(e,errors.GROUP_NOT_FOUND)
            }
        });
        it('should return true', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maoir", uuid)
            let group = await services.deleteGroup("benfica", uuid)
            assert.equal(group, true)
        });

    });

    describe('#deleteMovie', function () {
        if (fs.existsSync("storage.json")) {
            fs.unlinkSync("storage.json")
        }
        it('should throw USER_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            try {
                await services.deleteMovie("benfica", undefined, "tt1375666")
            }catch (e) {
                assert.equal(e,errors.USER_NOT_FOUND)
            }
        });
        it('should throw GROUP_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            try {
                await services.deleteMovie("benfica", uuid, "tt1375666")
            }catch (e) {
                assert.equal(e,errors.GROUP_NOT_FOUND)
            }
        });
        it('should throw MOVIE_NOT_FOUND', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maoir", uuid)
            try {
                await services.deleteMovie("benfica", uuid, "t1375666")
            }catch (e) {
                assert.equal(e,errors.MOVIE_NOT_FOUND)
            }
        });
        it('should return true', async function () {

            await dataMem.onStartUp()
            let uuid = await services.createUser()
            await services.createGroup("benfica", "é o maior", uuid)
            let movie = await services.deleteMovie("benfica", uuid, "tt1375666")

            assert.equal(movie,true)
        });

    });

});