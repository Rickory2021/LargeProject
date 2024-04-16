# MongoDB Workflow

## MongoDB Overview

MongoDB is a NoSQL database management system with great scalability, great JSON convertor, and flexible database for changes.

## MongoDB vs MySQL

| MongoDB                                                                                                                                                                                  | MySQL                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uses NoSQL<br>MongoDB does not adhere to the traditional relational database model.<br>MongoDB would use a document-orientated system, creating a tree-like database, using document id. | Uses SQL<br>MySQL uses Standard Query Language.<br>MySQL would use a schema to create a table-like database, using Foreign Key and Private Keys.                                                                      |
| JSON Friendly<br>MongoDB uses what is known as Binary JSON (BSON). This means that sending data is very convenient.                                                                      | Json Neutral<br>MySQL doesn’t have any JSON help, so you had to just create a JSON from starch                                                                                                                        |
| Database is found in MongoDB Atlas<br>MongoDB Atlas is a free service that is meant to host with MongoDB.                                                                                | Database is found in the Server<br>MySQL would have to add it to the server that you are developing.<br>Though this works, having a custom-made server for MongoDB is much better than using your own server to host. |
| Flexible<br>Since it is documents-orientated system, it can add and remove data new data type quickly and easily.<br>                                                                    | Nonflexible<br>Since it is a table-like database, it can add new and remove new data easily, but it does take time.<br>                                                                                               |

# Video Resources

Provided below are resources if you would prefer a visual/audio resource to learn about MongoDB as well.<br>
NOTE: Videos should cover everything you need for MongoDB; however, continue reading for more details on our project.

MongoDB Introduction & Installation:<br>

- [Learn MongoDB in 1 Hour 🍃(2023)](https://youtu.be/c2M-rlkkT5o?si=fk2gN4vAl2Yf5Y41)

MongoDB with Mern (From Leinecker):<br>

- [Getting Started with MERN A](https://youtu.be/p3m3riYbWfc?si=nlx2Knyi6Yi8bhJP)

# Large Project ERD

Note: This ERD is the mostly Final ERD, the actual database may changed based on what the project needs.<br>
To ensure you know the current Diagram, check the actual Database.
![ERD Diagram of Project](images\MONGODB\0_ERD.png)

# MongoDB with MERN

For a MERN Stack, you DO NOT NEED to download any MongoDB Software.<br>
Node.js comes along with its own MongoDB shell, so all you need to do is at add the MongoDB dependencies and MongoDB will work in the Project.<br>
Essentially you only need to set MongoDB once on the Project with Node.js and you don’t have to worry about downloading anything else for MongoDB.

# MongoDB Access

Although you don’t need to download other MongoDB Software, it would be helpful if you had some software that helps you visualize the database.<br>
MongoDB Compass ([https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)) is an excellent GUI for MongoDB that allows you to easily see and edit the database.

## MongoDB Compass Setup

1. Go to [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass) and download the .exe file of your respective OS
2. Launch the MongoDB Compass exe file for installation
3. Launch the MongoDB Compass App
4. MongoDB will default to “mongodb://localhost:27017,” which would connect to the MongoDB of the local host.<br>Instead, we will connect to our connection string (Check discord information. Shown here is just an example) “mongodb+srv://\<User\>:\<Password\>@cluster0.rand.mongodb.net” to connect to the Project’s MongoDB Atlas’s Server<br>Subsitute \<User\> and \<Password\> based on the credintials found in Discord
5. Under “inventory_tracker” is the Database for our Project

![In the MongoDB Compass Directory should show "inventory_tracker"](images\MONGODB\1_MongoDB_Compass_Database.png)

# MongoDB & API Workflow

- Edit API Endpoints
  - Go to the LargeProject’s server.js
- Test API Endpoints
  - Start the Backend and use ARC or SwaggerHub to Test
  - Once set up, API Endpoint Test will be swapped to the Actual Server.
- Editing Database / Checking API is Working
  - Go to MongoDB Compass to see the Database in its entirety.

# MongoDB & Front-End Workflow

- Add API Endpoints to Web/App
- Test API Endpoints
  - Start the Frontend and Backend
  - Test the API Endpoints through the Web/App
- Editing Database / Checking API Endpoint is Working
  - Go to MongoDB Compass to see the Database in its entirety.
