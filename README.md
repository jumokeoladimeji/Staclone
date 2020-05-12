# Staclone
* A simple clone of Stackoverflow


## Database Diagram
This can be found in db-diagram.png


## Tools Used
| **Dependency** | **Use** |
|----------|-------|
|Nodejs|It is fast. It is JavaScript run-time environment for executing JavaScript code|
|Mongodb| A document database with the scalability and flexibility that you want with the querying and indexing that you need |
|Express| A flexible Node.js web application framework|


## Test Tools
| **Dependency** | **Use** |
|----------|-------|
|Mocha| JavaScript testing library |
|Chai| A BDD/TDD assertion library for node and the browser that can be paired with any javascript testing framework|


## HTTP ENDPOINTS
## User
| **HTTP method** | **Service layer method** | **Actions** |
| --- | --- | --- |
| POST /api/v1/user/signup  | user.signup() | create new user|
| GET /api/v1/user/signin  | user.signin() | user sigin |
| GET /api/v1/users/1/search  | user.search() | search users |


## Questions
| **HTTP method** | **Service layer method** | **Actions** |
| --- | --- | --- |
| POST /api/v1/questions   | question.create() | create new Question|
| GET /api/v1/questions   | question.getAll() | get all Questions |
| GET /api/v1/question/1  | question.get() | get single Question |
| PUT /api/v1/questions/1/upvote   | question.upvote() | Upvote a Question|
| PUT /api/v1/questions/1/downvote   | question.downvote() | Downvote a Question |
| POST /api/v1/questions/1/answer   | question.addAnswer() | Answer a Question and notify the user |
| GET /api/v1/filter   | question.search() | filter all Questions based on query e.g. `http://localhost:3000/api/v1/filter?search=javascript `|


### Set Up locally
* git clone
* cd to Staclone

### Installing dependencies
Run
```
npm install
```

### DB set up
Create a mongoDb database in cloud(used mongolab)


### To start the app
* Start app
```
npm start
```
or
```
nodemon start
```

### Running tests
* Create the test database

* Run the tests
```
npm test
```

MongoDB documents are currently restricted to a maximum of 16MB. Hence why I separated the upvote and downvote collections considering a question will have many votes

A user can downvote and negate the downvote 
A user can upvote and negate the upvote
A user can downvote and then upvote and vice versa.

