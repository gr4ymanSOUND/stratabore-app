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
        {jobNumber: 'ZZZ-2627', location: 'Istanbul, Turkey', numHoles: 2, numFeet: 100, rigId: 4},
        {jobNumber: 'ZZZ-2628', location: 'Berlin, Germany', numHoles: 4, numFeet: 80, rigId: 4},
        {jobNumber: 'ZZZ-2629', location: 'Vancouver, Canada', numHoles: 4, numFeet: 80, rigId: 4},
        {jobNumber: 'ZZZ-2630', location: 'Vancouver, Washington', numHoles: 3, numFeet: 60, rigId: 4},
        {jobNumber: 'RYS-26', location: 'NY, NY', numHoles: 5, numFeet: 200, rigId: 4},
        {jobNumber: 'I-2', location: 'Boston, MA', numHoles: 2, numFeet: 30, rigId: 4},
        {jobNumber: 'Z-6', location: 'Sacramento, CA', numHoles: 2, numFeet: 40, rigId: 4},
        {jobNumber: 'WELL-666', location: 'Chicago, IL', numHoles: 1, numFeet: 20, rigId: 4},
        {jobNumber: 'ABFC-123', location: 'Ft. Worth, TX', numHoles: 3, numFeet: 60, rigId: 4},
        {jobNumber: 'DEF-456', location: 'Dallas, TX', numHoles: 5, numFeet: 100, rigId: 4},
        {jobNumber: 'GHI-100', location: 'Nowhere, KS', numHoles: 2, numFeet: 50, rigId: 4},
        {jobNumber: 'GHI-200', location: 'St. Louis, MO', numHoles: 2, numFeet: 50, rigId: 4},
        {jobNumber: 'GHI-300', location: 'Honolulu, Hawaii', numHoles: 2, numFeet: 50, rigId: 4},
        {jobNumber: 'GHI-7400', location: 'Deep Space', numHoles: 2, numFeet: 50, rigId: 4},
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