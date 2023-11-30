For this semester the teacher challenged us to create an application (CMDB) using JavaScript and Node.js. 

The objective of this application, is to allow the user to search and store information about films into groups. This is made possible through accessing IMDB, either by searching or by getting the top 250 films.

The information about a given movie, once obtained, will  either be displayed on our website or available through our API. To do so our app relies on a set of core libraries such as:

 - **Express.js** framework to handle the web-related functionality of the application;
 - **Request** for handling HTTP requests;
 - **Passport.js** for user authorization;
 -  **Express-session** for managing sessions;
 - **Node-fetch** for making HTTP requests
 - **Bootstrap** for styling the HTML pages;
 - **Handlebars** for rendering the HTML pages
 - **CORS** for handling cross-origin resource sharing;
 -  **Mocha and Jest** for testing;
 -  **Morgan** for logging HTTP requests;

To achieve the modularity of our application we divided it into 5 modules:

 - **Services**: This module is responsible for handling the application logic. It's where most of the work of your application takes place. It receives requests from the upper API module, takes in its information, and passes the correct information onto the Data layer. It then returns a response which the services module will pass back to the upper layer. and returns a response. It is also responsible for the handling of any errors that might occur during the processing of a request;

- **Data**: This module is responsible for retrieving and storing information about the movies and the users. It is able to store data onto two types storages. The first being by memory. By using a .json file (`storage.json`) all the information about the users and their groups will be stored there in a hierarchical form. There are two top objects, *users* and *logins*. Under *logins* each user is an object with a password and a token. The token is used to access the relative group information stored under users. Each token corresponds to an object with an array of groups inside.
The latter uses a database called [ElasticSearch](https://www.elastic.co/) and stores the information onto indexes and documents. Our application only has a permanent index named *logins*. Here the login information of our users is stored in a document for each. This includes it's username, password and id for the index where the information about its groups is going to be stored. On a given groups index, each document represents a group. 
Each group, no matter the storage type, is always comprised of:
-- ID
-- Name
-- Movie Array
-- Description
-- Total duration


- **Server**: This module is responsible for the routing between the request a user might make to the API or website and its correct module;

- **API**: This module is responsible for the routing of API operations to the services module;

- **Site**: This module is responsible for the routing and serving of the websites HTML pages and the necessary information to render the;

All though not necessarily a module, the application also has a dedicated file for error handling. This was made so for organizational purposes.

The client side is divided into 7 parts.
A home landing page, a page with a list of the top 250 movies, a page for the user to access its groups, a login and signup page, pages with the information about a group, pages with information about movies and a search page.
These operations also reflect how the server API functions, with the added benefit that the user does not need to know any tokens or id's in order to realize any operation.

The server API is made up of 11 operations.
- `/popular-movies` a get request that returns a list of the most popular IMDB movies. Supports a query argument to impose a limit on the number of movies returned. Default is 250.
- `/search-movies` a get request that returns a list of the movies related to the search query. Has a query argument for the name of the movie and also a limit query just like `/popular-movies`.
- `/movie` a get request that returns detailed information about a film including: ID, title, description, image URL, runtime in minutes, directors and actors. It takes in the movie name as a query parameter.
- `/user` a get request that creates a user token in order to be used to create/delete/edit groups.
- `/group`  a post request that creates a new group. It takes in a `.json` file containing the name and description for the group. In order to realize such operation it needs authentication in the form of a **Bearer Token**, as does any operation involving groups.
- `/group` a delete request that deletes a given group. It receives in the form of a query parameter an id and/or name for the group.
- `/edit-group` a post request that edits a give group. It receives in the form of a query parameter an id and/or name for the group and also a `.json`file in the request body with the new name and description to be changed.
- `/list-groups` a get request that returns in the form of a `.json` file containing an array with every group for a given user.
- `/group-details` a get request that returns in the form of a `.json` file containing the group object. It receives in the form of a query parameter an id and/or name for the group.
- `/add-movie` a post request that adds a new movie to a given group. It receives in the form of a query parameter an id and/or name for the group and also a `.json` file containing the id for the movie to be added.
- `/delete-movie/{movieID}`a delete request that removes a movie from a given group. It receives in the form of a query parameter an id and/or name and a required path parameter with the id of the movie to be deleted.
In order to run our application one only needs to have the above declared dependencies installed and run the file named `cmdb-server.mjs`. Same goes for the tests.
Also either use the memory storage, or if using elastic search changing the file imported as dataMem to `cmdb-db.mjs` and either having a local elastic search node running or changing the serverUrl in `elasticSearch-client.mjs` to one to be used.



