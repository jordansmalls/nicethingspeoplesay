import User from "../models/user.model.js"

// @desc    create user
// @route   POST /api/auth
// @access  public

export const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Invalid credentials: missing email or password" });
        }

        let emailTaken = await User.findOne({ email });

        if (emailTaken) {
            return res.status(409).json({ message: "Email taken." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Passwords must be at least 8 characters." });
        }

        const user = await User.create({
            email,
            password,
        });

        if (!user) {
            return res.status(500).json({
                message: "We're having trouble creating your account, please try again.",
            });
        } else {
            // login user with JWT on successful account creation
            generateToken(res, user._id);
            return res.status(201).json({
                _id: user._id,
                email: user.email,
                created: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    check if an email is taken
// @route   GET /api/auth/check-email/:email
// @access  public

export const checkEmailAvailability = async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            return res.status(400).json({ message: "Invalid credentials: email missing" });
        }

        const isTaken = await User.findOne({ email });

        if (isTaken) {
            return res.status(200).json({ message: "Email is already in use.", taken: true });
        } else {
            return res.status(200).json({ message: "Email available!", taken: false });
        }
    } catch (err) {
        console.error("There was an error checking the availability of an email:", err);
        return res.status(500).json({ message: "We're having trouble, try again." });
    }
};

// @desc    login user
// @route   POST /api/auth/login
// @access  public

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// @desc    logout user
// @route   POST /api/auth/logout
// @access  public

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ message: "Logged out successfully. Please come back." });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            message: "We're having trouble logging you out, please try again.",
        });
    }
};

// @desc    update account password
// @route   PUT /api/auth/password
// @access  private

export const updateAccountPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const id = req.user._id;

    try {
        if (!id || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "Invalid credentials: required field missing" });
        }

        // find user by their authenticated ID
        const user = await User.findById(id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // check if current password is correct
        const isCurrentPasswordValid = await user.matchPassword(currentPassword);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: "Incorrect current password." });
        }

        // update user password - hashed by pre save method DB
        user.password = newPassword;
        const success = await user.save();

        if (success) {
            return res.status(200).json({ message: "Password updated successfully" });
        } else {
            console.error("There was a DB error while attempting to update a user's password.");
            return res.status(500).json({ message: "We're having trouble, please try again." });
        }
    } catch (err) {
        console.error("There was an error attempting to update a user's password:", err);
        return res.status(500).json({
            message: "We're having trouble updating your password, please try again.",
        });
    }
};

// @desc    delete user account
// @route   DELETE /api/auth
// @access  private

export const deleteAccount = async (req, res) => {
    const id = req.user?._id;

    if (!id) {
        return res.status(400).json({ message: "Invalid credentials: id missing" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res
            .status(200)
            .json({ message: "Account deletion successful. Please come back soon." });
    } catch (err) {
        console.log("There was an error attempting to delete a user account:", err);
        return res.status(500).json({
            message: "We're having trouble deleting your account, please try again later.",
        });
    }
};

// @desc    fetch user account
// @route   GET /api/auth
// @access  private

export const fetchUserAccount = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            email: req.user.email,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        });
    } else {
        return res.status(404).json({ message: "User not found" });
    }
};