const client = require('../client');

async function getAllJobs() {
    try {
        const { rows: allJobs } = await client.query(`
        SELECT *
        FROM jobs;
    `);
    return allJobs;
    } catch (error) {
        throw error;s
    }
}

async function createJob(jobInfo) {

    try {

        const valueString = Object.keys(jobInfo).map(
          (key, index) => `$${ index+1 }`
        ).join(', ');
    
        const keyString = Object.keys(jobInfo).map(
          (key) => `"${ key }"`
        ).join(', ');
    
        const {rows: [newJob]} = await client.query(`
          INSERT INTO jobs (${keyString})
          VALUES (${valueString})
          RETURNING *;
        `, Object.values(jobInfo));
    
        return newJob;

      } catch (error) {
        throw error;
      }

}

module.exports = {
    getAllJobs,
    createJob,
};