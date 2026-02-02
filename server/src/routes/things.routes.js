import e from "express"
const router = e.Router()
import { protect } from "../middleware/auth.middleware.js";
import {
    createThing,
    deleteAllThings,
    deleteThing,
    exportThings,
    getAllThings,
    getThingById,
    updateThing
} from "../controllers/thing.controller.js"

import { lightLimiter, strictLimiter } from "../utils/rate.limit.js";

// @desc    create new thing
// @route   POST /api/things/
// @access  private
router.post("/", protect, lightLimiter,createThing)

// @desc    get all user things
// @route   GET /api/things/
// @access  private
router.get("/", protect, lightLimiter,getAllThings);

// @desc    get single thing
// @route   GET /api/things/:id
// @access  private
router.get("/:id", protect, lightLimiter,getThingById);

// @desc    update thing
// @route   PUT /api/things/:id
// @access  private
router.put("/:id", protect, strictLimiter,updateThing);

// @desc    delete thing
// @route   DELETE /api/things/:id
// @access  private
router.delete("/:id", protect, lightLimiter,deleteThing);

// @desc    delete all user things
// @route   DELETE /api/things/
// @access  private
router.delete("/", protect, strictLimiter,deleteAllThings);

// @desc    export all things
// @route   GET /api/things/export?format=json or ?format=txt
// @access  private
router.get("/export", protect, strictLimiter,exportThings);


export default router;