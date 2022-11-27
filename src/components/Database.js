import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../axios-services/index';

const Database = ({ token }) => {

    const testJobs = [
        {
            jobId: 1,
            location: "Plano, TX",
            numHoles: 2,
            numFeet: 50,
            rigId: 3
        } ,
        {
            jobId: 2,
            location: "Sachse, TX",
            numHoles: 1,
            numFeet: 20,
            rigId: 2
        } ,
        {
            jobId: 3,
            location: "Parker, TX",
            numHoles: 3,
            numFeet: 60,
            rigId: 1
        }
    ]

    const [ joblist, setJobList ] = useState([]);

    useEffect(() => {

        const fetchJobs = async () => {
            try {
                const jobs = await getAllJobs(token);
                setJobList();
            } catch (error) {
                console.log(error);
            }

        }

        fetchJobs();

    }, [])


    return (
        <>
            <div className='job-list-container'>
                {joblist.map((job) => {

                    return (
                        <div className='single-job' key={job.jobId}>
                            <div>ID: {job.jobId}</div>
                            <div>Location: {job.location}</div>
                            <div># Holes: {job.numHoles}</div>
                            <div>Total Ft: {job.numFeet}</div>
                            <div>Rig: {job.rigId}</div>
                        </div>
                    )

                })}
            </div>
        </>
        
    )
}

export default Database;