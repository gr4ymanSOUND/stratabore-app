// helper function to translate the back-end user object's syntax to the front-end syntax
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
  }
}

const userSyntaxBackEnd = (userObject) => {
  // userObject.isAdmin ? userObject.isAdmin = 1 : userObject.isAdmin = 0;
  return {
    id: userObject.id,
    first_name: userObject.firstName,
    last_name: userObject.lastName,
    username: userObject.userName,
    email: userObject.email,
    is_admin: userObject.isAdmin,
    status: userObject.status,
  }
}

export {userSyntaxBackEnd, userSyntaxFrontEnd};