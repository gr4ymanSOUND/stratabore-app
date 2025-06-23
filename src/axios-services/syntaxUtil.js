// helper functions to translate the back-end object's syntax to the front-end syntax

//Users

const userSyntaxFrontEnd = (userObject) => {
  userObject.is_admin ? userObject.is_admin = true : userObject.is_admin = false;
  return {
    id: userObject.id,
    firstName: userObject.first_name,
    lastName: userObject.last_name,
    userName: userObject.username,
    email: userObject.email,
    isAdmin: userObject.is_admin,
    status: userObject.status,
    rigId: userObject.rig_id || null, // Ensure rigId is null if not present
  }
}

const userSyntaxBackEnd = (userObject) => {
  return {
    id: userObject.id,
    first_name: userObject.firstName,
    last_name: userObject.lastName,
    username: userObject.userName,
    email: userObject.email,
    is_admin: userObject.isAdmin,
    status: userObject.status,
    rig_id: userObject.rigId || null, // Ensure rigId is null if not present
  }
}

//Rigs

const rigSyntaxFrontEnd = (rigObject) => {
  return {
    id: rigObject.id,
    licensePlate: rigObject.license_plate,
    rigType: rigObject.rig_type,
    boardColor: rigObject.board_color,
    registrationDueDate: rigObject.registration_due,
    maintenanceDueDate: rigObject.maintenance_due,
    status: rigObject.status,
    notes: rigObject.notes || '', // Ensure notes is always a string
  }
}

const rigSyntaxBackEnd = (rigObject) => {
  return {
    id: rigObject.id,
    license_plate: rigObject.licensePlate,
    rig_type: rigObject.rigType,
    board_color: rigObject.boardColor,
    registration_due: rigObject.registrationDueDate,
    maintenance_due: rigObject.maintenanceDueDate,
    status: rigObject.status,
    notes: rigObject.notes || '', // Ensure notes is always a string
  }
}

//Jobs

const jobSyntaxFrontEnd = (jobObject) => {
  return {
    id: jobObject.id,
    jobNumber: jobObject.job_number,
    client: jobObject.client,
    location: jobObject.location,
    numHoles: jobObject.num_holes,
    numFeet: jobObject.num_feet,
    jobLength: jobObject.job_length,
    status: jobObject.status,
    createdDate: jobObject.created_date,
    notes: jobObject.notes || '', // Ensure notes is always a string
  }
}

const jobSyntaxBackEnd = (jobObject) => {
  return {
    id: jobObject.id,
    job_number: jobObject.jobNumber,
    client: jobObject.client,
    location: jobObject.location,
    num_holes: jobObject.numHoles,
    num_feet: jobObject.numFeet,
    job_length: jobObject.jobLength,
    status: jobObject.status,
    created_date: jobObject.createdDate,
    notes: jobObject.notes || '', // Ensure notes is always a string

  }
}

//assignment

const assignmentSyntaxBackEnd = (assignmentObject) => {
  return {
    id: assignmentObject.id,
    client:  assignmentObject.client,
    job_number: assignmentObject.jobNumber, 
    created_date:  assignmentObject.createdDate,
    job_date:  assignmentObject.jobDate,
    job_length:  assignmentObject.jobLength,
    location:  assignmentObject.location,
    num_feet:  assignmentObject.numFeet,
    num_holes:  assignmentObject.numHoles,
    notes:  assignmentObject.notes || '', // Ensure notes is always a string
    job_id:  assignmentObject.jobId,
    rig_id:  assignmentObject.rigId,
    status:  assignmentObject.status,
  }
}

const assignmentSyntaxFrontEnd = (assignmentObject) => {
  return {
    id: assignmentObject.id,
    client:  assignmentObject.client,
    jobNumber: assignmentObject.job_number, 
    createdDate:  assignmentObject.created_date,
    jobDate:  assignmentObject.job_date,
    jobLength:  assignmentObject.job_length,
    location:  assignmentObject.location,
    numFeet:  assignmentObject.num_feet,
    numHoles:  assignmentObject.num_holes,
    notes:  assignmentObject.notes || '', // Ensure notes is always a string
    jobId:  assignmentObject.job_id,
    rigId:  assignmentObject.rig_id,
    status:  assignmentObject.status,
  }
}


export {
  userSyntaxBackEnd, 
  userSyntaxFrontEnd,
  rigSyntaxFrontEnd,
  rigSyntaxBackEnd,
  jobSyntaxFrontEnd,
  jobSyntaxBackEnd,
  assignmentSyntaxFrontEnd,
  assignmentSyntaxBackEnd
};

