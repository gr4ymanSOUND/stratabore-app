import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../axios-services/index';

const Database = ({ token }) => {


    const [ jobList, setJobList ] = useState([]);

    useEffect(() => {

        const fetchJobs = async () => {
            try {
                const jobs = await getAllJobs(token);
                setJobList(jobs);
            } catch (error) {
                console.log(error);
            }

        }

        fetchJobs();
        
    }, [])

    console.log('jobs', jobList)


    return (
        <>
        <div className='joblist-column-headers'>
            <div className='column numCol'>Number</div>
            <div className='column textCol'>Location</div>
            <div className='column numCol'># Holes</div>
            <div className='column numCol'>Total Ft</div>
            <div className='column numCol'>Rig</div>
        </div>
        <div className='database'>
            <div className='joblist-container'>
                {jobList.map((job) => {

                    return (
                        <div className='single-job' key={job.id}>
                            <div className='column numCol'>{job.jobNumber}</div>
                            <div className='column textCol'>{job.location}</div>
                            <div className='column numCol'>{job.numHoles}</div>
                            <div className='column numCol'>{job.numFeet}</div>
                            <div className='column numCol'>{job.rigId}</div>
                        </div>
                    )

                })}
            </div>
        </div>
        </>
    )
}

export default Database;