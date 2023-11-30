import request from 'supertest'
import {app} from '../cmdb-server.mjs'
import pkg from 'jest';
const { expect } = pkg;



describe('/user', () => {
  it('should return user data', function () {
  request(app)
    .get('/user')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect('Content-Length', '38')
    .expect(200);
  });
});

describe('/search-movies', () => {
  let response;
  async () => {
    response = await request(app)
      .get('/search-movies?movie-name=Godfather&limit=2')
      .expect(200);
  };

  it('should return a list of movies matching the search query', (done) => {
    // Verify that the response body contains the expected data
    if (response && response.body) {
      const body = response.body;
      expect(body).toEqual([
        {
          id:  'tt0068646',
        title: 'The Godfather',
        duration: 175 
        },
        {
          title: 'The Godfather: Part II',
          year: 1974,
          rating: 9.0
        }
      ]);
    } 
    done();
  });
});

describe('/popular-movies', () => {
  let response;
  async () => {
  response = await request(app)
  .get('/popular-movies?limit=3')
  .expect(200);
  };
  it('should return a list of popular movies', async () => {
    if (response && response.body) {
      const body = response.body;
    // Verify that the response body is an array
    expect(Array.isArray(body)).toBe(true)

    // Verify that the array contains the expected data
    expect(body).toEqual([
      {
        id:  'tt0111161',
        title: 'The Shawshank Redemption',
        duration: 142
      },
      {
        id:  'tt0068646',
        title: 'The Godfather',
        duration: 175
      },
      {
        id: 'tt0468569',
        title: 'The Dark Knight',
        duration: 152
      }
    ]);
  }
  });
});

describe('/auth/group', () => {
  let response;
  async () => {
    response = await request(app)
    .post('/auth/group')
    .send({
      name: 'benfica',
      description: 'benfica'
    })
    .expect(302);
  }
  it('should create a new group', async () => {
    if (response && response.body) {
      const body = response.body;
    // Verify that the response body contains the expected data
    expect(body).toEqual({
      id: expect.any(String),
      name: 'benfica',
      description: 'benfica'
    });
  }
  });
});

describe('/auth/list-groups', () => {
  let response;
  async () => {
    response = await request(app)
      .get('/auth/list-groups')
      .expect(200);
}
  // Verify that the response body is an array
  it('should return a list of groups', async () => {
    if (response && response.body) {
      const body = response.body;
    expect(Array.isArray(response.body)).toBe(true);

    // Verify that the array contains the expected data
    expect(response.body).toEqual([
      {
        id: expect.any(String),
        name: 'benfica',
        description: 'benfica'
      }
    ]);
  }
  });
});

describe('/auth/delete-group', () => {
  let response;
  async () => {
   response = await request(app)
    .post('/auth/delete-group')
    .send({
    name: 'benfica',
    id: expect.any(String)
  })    
  .expect(200);
}
  
  it('should delete a group', async () => {
    if (response && response.body) {
      const body = response.body;
    // Verify that the response body contains the expected data
    expect(body).toEqual({
      message: "Successfully deleted the group"
    });
  }
  });
});

describe('/auth/add-movie', () => {
  let response;
  async()=>{
  response = await request(app)
  .post('/auth/add-movie')
  .send({
    id:  'tt0111161',
    title: 'The Shawshank Redemption',
  })
  .expect(201);
  }
  // Verify that the response body contains the expected data
  it('should add a new movie', async () => {
    if (response && response.body) {
      const body = response.body;
    expect(body).toEqual({
      id: expect.any(String),
      movieID:  'tt0111161',
      title: 'The Shawshank Redemption'
      });
    }
  });
});