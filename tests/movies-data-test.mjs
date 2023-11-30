import assert from 'node:assert/strict'
import {getFilmById, getPopularMovies, searchByName} from "../data/cmdb-movies-data.mjs";

describe('Validate movies-data module', function () {
    describe('#getPopularMovies test', function () {
        it('should return of length 50', async function () {
            let array = await getPopularMovies(50)
            assert.equal(array.length,50)
        });
        it('should return of legnth 250', async function () {
            let array = await getPopularMovies()
            assert.equal(array.length,250)
        });
    });
    describe('#searchByName', function () {
        it('should not return empty array', async function () {
            let array = await searchByName("Inception")
            assert.notEqual(array.length,0)
        });
    });
    describe('#getFilmById', function () {
        it('should return movie object', async function () {
            let movie = await getFilmById("tt1375666")
            assert.equal(movie.id, "tt1375666")
            assert.equal(movie.title, "Inception")
            assert.equal(movie.duration, 148)
        });
    });
});

