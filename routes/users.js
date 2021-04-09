import express from 'express';

import userDB from '../models/userService';
import ValidationMiddleware from '../middleware/validation';

const router = express.Router();


// router.post('/', [ ValidationMiddleware.validJWTNeeded, (req, res) => {

//     userDB.createUser(req, res);}]
// );

// temp - to create users by an unauthenicated user.

router.post('/', (req, res) => {

    userDB.createUser(req, res);
});

router.get('/', (req, res) => {
    userDB.readUsers(req, res);
});

router.get('/:id', (req, res) => {

    userDB.readUser(req, res);

})



export default router;