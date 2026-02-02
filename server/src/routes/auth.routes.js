import e from "express"
const router = e.Router();
import { protect } from "../middleware/auth.middleware.js";
import {
    signup,
    checkEmailAvailability,
    login,
    logout,
    updateAccountPassword,
    deleteAccount,
    fetchUserAccount
} from "../controllers/auth.controller.js"

import { strictLimiter, emailCheckLimiter, lightLimiter } from "../utils/rate.limit.js";


// @desc    create user
// @route   POST /api/auth
router.post("/", strictLimiter, signup)

// @desc    check if an email is taken
// @route   GET /api/auth/check-email/:email
router.get("/check-email/:email", emailCheckLimiter,checkEmailAvailability);

// @desc    login user
// @route   POST /api/auth/login
router.post("/login", strictLimiter,login)

// @desc    logout user
// @route   POST /api/auth/logout
router.post("/logout", lightLimiter,logout)

// @desc    update account password
// @route   PUT /api/auth/password
router.put("/password", strictLimiter,updateAccountPassword)

// @desc    delete user account
// @route   DELETE /api/auth
// @access  private
router.delete("/", protect, lightLimiter,deleteAccount)

// @desc    fetch user account
// @route   GET /api/auth
// @access  private
router.get("/", protect, lightLimiter,fetchUserAccount)


export default router;