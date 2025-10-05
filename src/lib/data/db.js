// src/lib/db.js
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'lib', 'entities', 'user.json');

// Read users from JSON file
export function getUsers() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return {};
  }
}

// Write users to JSON file
export function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to users.json:', error);
    return false;
  }
}

// Find user by email
export function findUserByEmail(email) {
  const users = getUsers();
  return users[email] || null;
}

// Create new user
export function createUser(userData) {
  const users = getUsers();
  users[userData.email] = userData;
  return saveUsers(users) ? userData : null;
}