// grab our db client connection to use with our adapters
const client = require('../client');
const bcrypt = require('bcrypt');
const SALT = 13;

async function getAllUsers() {
    try {
      const allUsers = await client.query(`
        SELECT id, "firstName", "lastName", email, "userName", "isAdmin" 
        FROM users;
      `);
      return allUsers;
    } catch (error) {
      throw error;
    }
  }
  
  async function getUser({ userName, password }) {
  
    try {
      const {rows: [user]}= await client.query(`
        SELECT *
        FROM users
        WHERE "userName" = $1;
      `, [userName]);
      
      if (!user) {
        throw new Error('issue logging in');
      };
  
      const userPassword = user.password;
      const passwordMatch = await bcrypt.compare(password, userPassword);
      if (!passwordMatch) return;
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async function createUser(userInfo) {
    try {
      const hashedPassword = await bcrypt.hash(userInfo.password, SALT);
      userInfo.password = hashedPassword;
      const valueString = Object.keys(userInfo).map(
        (key, index) => `$${ index+1 }`
      ).join(', ');
  
    const keyString = Object.keys(userInfo).map(
        (key) => `"${ key }"`
      ).join(', ');
  
      const {rows: [newUser]} = await client.query(`
        INSERT INTO users (${keyString})
        VALUES (${valueString})
        RETURNING *;
      `, Object.values(userInfo));
  
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  
  async function getUserById(id) {
    try {
      const {rows: [user]} = await client.query(`
        SELECT *
        FROM users
        WHERE id = $1;
      `, [id]);
  
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async function getUserByUserName(userName) {
    try {
      const {rows: [user]}= await client.query(`
        SELECT *
        FROM users
        WHERE "userName" = $1;
      `, [userName]);
      
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {
    getAllUsers,
    getUser,
    getUserById,
    getUserByUserName,
    createUser
  };