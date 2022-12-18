const jobRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const { getAllJobs, createJob } = require('../db/models/jobs');

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

    const { newJob } = req.body;

    try {

        const addedJob = await createJob(newJob);

        res.send(addedJob);
        
    } catch (error) {
        console.log(error);
        res.next(error);
    }

});

module.exports = jobRouter;