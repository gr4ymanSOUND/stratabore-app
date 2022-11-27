const {
    client,
    Users,
    Jobs
    // declare your model imports here
    // for example, User
} = require('./');


async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order (reverse of creation, delete depending tables first)

      await client.query(`
      DROP TABLE IF EXISTS jobs;
      DROP TABLE IF EXISTS users;
      `)

    // build tables in correct order

    await client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          "firstName" VARCHAR(255) NOT NULL,
          "lastName" VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL, 
          "userName" VARCHAR(255) UNIQUE NOT NULL, 
          password VARCHAR(255) UNIQUE NOT NULL,
          "isAdmin" BOOLEAN DEFAULT false
        );
    
      CREATE TABLE jobs (
          id SERIAL PRIMARY KEY,
          "jobNumber" VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          "numHoles" INTEGER NOT NULL DEFAULT 1,
          "numFeet" INTEGER NOT NULL DEFAULT 20,
          "rigId" INTEGER NOT NULL
      );
      
  `)
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {

    const usersToCreate =   [
        {firstName:'Tommy', lastName:'Lawrence', email:'tommy@stratabore.com', userName:'bossman', password:'bossmanistheboss', isAdmin: true },
        {firstName:'Austin', lastName:'Lawrence', email:'austin.lawrence.al@gmail.com', userName:'coolhatguy', password:'ochocinco', isAdmin: true},
        {firstName:'Meghan', lastName:'Lawrence', email:'test@email.email', userName:'meguhman', password:'dotterbore', isAdmin: true}
      ];
 
      console.log("creating users");

      const users = await Promise.all(usersToCreate.map(Users.createUser));
      
      console.log(users);
      console.log("finished creating users!!");

      const jobsToCreate = [
        {jobNumber: 'EWL-227', location: 'Plano, TX', numHoles: 3, numFeet: 60, rigId: 3},
        {jobNumber: 'TER-321', location: 'Sachse, TX', numHoles: 1, numFeet: 20, rigId: 2},
        {jobNumber: 'AAA-111', location: 'Parker, TX', numHoles: 5, numFeet: 1000, rigId: 1},
        {jobNumber: 'ZZZ-2626', location: 'Sea of Tranquility, Moon', numHoles: 3, numFeet: 120, rigId: 4},
      ];

      console.log("creating jobs");

      const jobs = await Promise.all(jobsToCreate.map(Jobs.createJob));

      console.log(jobs);
      console.log("finished creating jobs!!");

}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());