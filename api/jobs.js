const jobRouter = require('express').Router();
const { requireUser } = require('../api/utils');
const { getAllJobs } = require('../db/models/jobs');

jobRouter.get('/', requireUser, async (req, res, next) => {

    try {

        const jobs = await getAllJobs();

        res.send(jobs);
        
    } catch (error) {
        console.log(error);
        res.next(error);
    }

});

module.exports = jobRouter;