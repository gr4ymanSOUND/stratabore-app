const jobRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const { getAllJobs, createJob, destroyJob, updateJob } = require('../db/models/jobs');

jobRouter.get('/', async (req, res, next) => {
  try {
    const jobs = await getAllJobs();
    res.send(jobs);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

jobRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { newJob } = req.body;
    const addedJob = await createJob(newJob);
    res.send(addedJob);
  } catch (error) {
    console.log(error);
    res.next(error);
  }
});

jobRouter.delete('/:jobId', requireUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const deletedJob = await destroyJob(jobId);
    res.send(deletedJob);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

jobRouter.patch('/:jobId', requireUser, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { newJobData } = req.body;

    console.log('api for job update reached, id:', jobId);
    console.log('job data for update', newJobData)

    const updatedJob = await updateJob(jobId, newJobData);
    res.send(updatedJob);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = jobRouter;