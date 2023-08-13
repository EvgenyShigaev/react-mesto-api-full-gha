const router = require('express').Router();

const {
  getUsers, getUser, currentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const {
  validationGetUsers,
  validationUpdateUser,
  validationUpdateAvatar,

} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', currentUser);
router.get('/:userId', validationGetUsers, getUser);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
