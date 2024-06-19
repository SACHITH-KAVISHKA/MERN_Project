const express = require('express');
const { signup, login, logout, userProfile, editUser, deleteUser } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();


// /api/signup
router.post('/signup', signup);
// /api/login
router.post('/login', login);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me',isAuthenticated, userProfile);
// api/delete/id
router.delete('/delete/:id',deleteUser);
// api/edit/id
router.put('/edit/:id',editUser);

module.exports = router;
