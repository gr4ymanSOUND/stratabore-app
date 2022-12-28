const client = require('../client');

async function getAllJobs() {
  try {
    const { rows: allJobs } = await client.query(`
      SELECT *
      FROM jobs;
    `);
    return allJobs;
  } catch (error) {
    throw error;
  }
}

async function createJob(jobInfo) {
  try {
    const valueString = Object.keys(jobInfo).map(
      (key, index) => `$${index + 1}`
    ).join(', ');
    const keyString = Object.keys(jobInfo).map(
      (key) => `"${key}"`
    ).join(', ');
    const { rows: [newJob] } = await client.query(`
      INSERT INTO jobs (${keyString})
      VALUES (${valueString})
      RETURNING *;
      `, Object.values(jobInfo));
    return newJob;
  } catch (error) {
    throw error;
  }
}

async function destroyJob(jobId) {
  try {
    const { rows: [destroyedJob] } = await client.query(`
      DELETE FROM jobs
      WHERE id = $1
      RETURNING *;
      `, [jobId]);
    return destroyedJob;
  } catch (error) {
    throw error;
  }
};

async function updateJob(jobId, jobInfo) {
  try {
    console.log('db model newJobData', jobInfo);
    const valueString = Object.keys(jobInfo).map(
      (key, index) => `"${key}" = '${jobInfo[key]}'`
    ).join(', ');
    const { rows: [updatedJob] } = await client.query(`
      UPDATE jobs
      SET ${valueString}
      WHERE id = $1
      RETURNING *;
    `, [jobId]);
    return updatedJob;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllJobs,
  createJob,
  destroyJob,
  updateJob
};