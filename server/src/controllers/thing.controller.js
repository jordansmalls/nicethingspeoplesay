import Thing from "../models/thing.model.js";

// @desc    create new thing
// @route   POST /api/things
// @access  private
export const createThing = async (req, res) => {
    try {
        const { thing, who, why } = req.body;

        if (!thing || !who) {
            return res.status(400).json({ message: "Thing text and who said it are required." });
        }

        const newThing = await Thing.create({
            user: req.user._id,
            thing,
            who,
            why,
        });

        return res.status(201).json(newThing);
    } catch (err) {
        console.error("Create thing error:", err);
        return res.status(500).json({ message: "Server error creating entry." });
    }
};

// @desc    get all user things
// @route   GET /api/things
// @access  private
export const getAllThings = async (req, res) => {
    try {
        const things = await Thing.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(things);
    } catch (err) {
        console.error("Get all things error:", err);
        return res.status(500).json({ message: "Server error fetching entries." });
    }
};

// @desc    get single thing
// @route   GET /api/things/:id
// @access  private
export const getThingById = async (req, res) => {
    try {
        const thing = await Thing.findOne({ _id: req.params.id, user: req.user._id });

        if (!thing) return res.status(404).json({ message: "Entry not found." });

        return res.status(200).json(thing);
    } catch (err) {
        console.error("Get thing error:", err);
        return res.status(500).json({ message: "Server error fetching entry." });
    }
};

// @desc    update thing
// @route   PUT /api/things/:id
// @access  private
export const updateThing = async (req, res) => {
    try {
        const { thing, who, why } = req.body;

        const updated = await Thing.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { thing, who, why },
            { new: true, runValidators: true },
        );

        if (!updated) return res.status(404).json({ message: "Entry not found." });

        return res.status(200).json(updated);
    } catch (err) {
        console.error("Update thing error:", err);
        return res.status(500).json({ message: "Server error updating entry." });
    }
};

// @desc    delete thing
// @route   DELETE /api/things/:id
// @access  private
export const deleteThing = async (req, res) => {
    try {
        const deleted = await Thing.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!deleted) return res.status(404).json({ message: "Entry not found." });

        return res.status(200).json({ message: "Entry deleted successfully." });
    } catch (err) {
        console.error("Delete thing error:", err);
        return res.status(500).json({ message: "Server error deleting entry." });
    }
};

// @desc    delete all user things
// @route   DELETE /api/things
// @access  private
export const deleteAllThings = async (req, res) => {
    try {
        await Thing.deleteMany({ user: req.user._id });
        return res.status(200).json({ message: "All entries deleted successfully." });
    } catch (err) {
        console.error("Delete all things error:", err);
        return res.status(500).json({ message: "Server error deleting entries." });
    }
};

// @desc    export all things as JSON or plaintext
// @route   GET /api/things/export?format=json or ?format=txt
// @access  private
export const exportThings = async (req, res) => {
    try {
        const { format } = req.query;

        const things = await Thing.find({ user: req.user._id }).sort({ createdAt: 1 });

        if (format === "json") {
            return res.status(200).json(things);
        }

        if (format === "txt") {
            const text = things
                .map(
                    (t, i) =>
                        `${i + 1}. "${t.thing}" — ${t.who}${t.why ? `\n   Why: ${t.why}` : ""}\n   Date: ${new Date(
                            t.createdAt,
                        ).toLocaleDateString()}\n`,
                )
                .join("\n");

            res.setHeader("Content-Type", "text/plain");
            return res.status(200).send(text);
        }

        return res.status(400).json({ message: "Invalid format. Use json or txt." });
    } catch (err) {
        console.error("Export things error:", err);
        return res.status(500).json({ message: "Server error exporting entries." });
    }
};
