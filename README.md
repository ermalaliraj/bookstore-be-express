# API built in NodeJS - Express

### Run the code
    npm install

### Execute the App
    npm start                        =>  will run the server in local on port 5000
    npm run test-unit-book           =>  will run unit tests of service Book
    npm run test-unit-transaction    =>  will run unit tests of service Transaction
    npm run test-unit-all            =>  will run enter test suite
   
    npm run test-integration-book           =>  will run unit Integration tests
    npm run test-integration-transaction    =>  will run unit Integration tests
    npm run test-integration-all            =>  will run unit Integration tests
    
    npm run test-all                =>  will run all test suite
                
### ENV variable
Environment variables must be set up in the system or in the .env file.
For testing purpose you can use the already present MongoDB url

    MONGO_URI=mongodb+srv://devx:kr45Fz8gFNp8vEPg@dev.mioms8o.mongodb.net/bookstore
    
### Test the App

1. ```npm start```
2. Use REST calls present in [book.http](./REST/book.http)

### DB model

![DB Model](./doc/DB_model.JPG)