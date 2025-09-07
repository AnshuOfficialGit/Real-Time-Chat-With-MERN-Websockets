const express = require("express");
const router = express.Router();
const authController = require("../app/controller/auth/authController");
const userController = require("../app/controller/users/userController");
const chatController = require("../app/controller/chat/chatController");
const verify = require("../app/middleware/Verification");
const rateLimiter = require("../app/middleware/RateLimit");
const validate = require("../app/middleware/Validation");
const { userSchema } = require("../app/request");

router.use(rateLimiter);
router.post("/login", authController.login);
router.post("/register", validate(userSchema), authController.register);

router.use(verify);
router.get("/users", userController.list);
router.post("/update-socket", userController.update);

router.get("/chat-messages/:receiver_id", chatController.messages);

router.get("/single-user/:id", userController.details);
module.exports = router;
