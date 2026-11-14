require("dotenv").config();
const User = require("../Models/userschema");
const cloudinary = require("../Config/cloudinary");
const { getUserFromReq } = require("../middleware/auth");

// Smart user resolver: checks cookies (via cookie-parser) first, then email param, then fallback
async function resolveUser(email, req = null) {
    // 1. Try to get email or id from cookie-parser (req.cookies.token)
    if (req) {
        const authUser = getUserFromReq(req);
        if (authUser?.id) {
            const userById = await User.findById(authUser.id);
            if (userById) return userById;
        }
        if (authUser?.email && !email) {
            email = authUser.email;
        }
    }

    if (email && typeof email === 'string' && email.trim()) {
        const trimmed = email.trim();
        // 2. Try case-insensitive email match
        let user = await User.findOne({
            email: { $regex: new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });
        if (user) return user;
    }

    // 3. Fallback: find the most recently created / active user in MongoDB
    const recentUser = await User.findOne().sort({ _id: -1 });
    if (recentUser) return recentUser;

    // 4. If no user exists in DB at all, create one
    const defaultEmail = email && typeof email === 'string' && email.trim() ? email.trim() : "ravi.pandey@example.com";
    return await User.create({
        firstName: "Ravi",
        lastName: "Pandey",
        email: defaultEmail,
        password: "defaultPassword123",
        confirm_password: "defaultPassword123",
        profileImage: "",
        bio: ""
    });
}

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image file to upload."
            });
        }

        const email = req.body?.email || req.query?.email;
        const user = await resolveUser(email, req);

        let imageUrl = "";

        // Check if Cloudinary credentials are valid
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const hasCloudinary = cloudName && 
                              cloudName !== 'your_cloud_name' && 
                              apiKey && 
                              apiKey !== 'your_api_key' &&
                              apiSecret &&
                              apiSecret !== 'your_api_secret';

        if (hasCloudinary) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "expense-tracker-profiles",
                            public_id: `profile_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
                            overwrite: true,
                            resource_type: "auto",
                            transformation: [
                                { width: 300, height: 300, crop: "fill", gravity: "face" }
                            ]
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });

                imageUrl = result.secure_url || result.url;
                console.log(`Cloudinary photo uploaded for ${user.email}:`, imageUrl);
            } catch (cloudErr) {
                console.warn("Cloudinary upload failed, using direct base64 fallback:", cloudErr.message);
                const mime = req.file.mimetype || "image/jpeg";
                imageUrl = `data:${mime};base64,${req.file.buffer.toString("base64")}`;
            }
        } else {
            // Direct Base64 database storage
            const mime = req.file.mimetype || "image/jpeg";
            imageUrl = `data:${mime};base64,${req.file.buffer.toString("base64")}`;
        }

        // SAVE DIRECTLY TO USER IN MONGODB
        user.profileImage = imageUrl;
        await user.save();
        await User.updateOne({ _id: user._id }, { $set: { profileImage: imageUrl } });

        console.log(`Profile photo successfully saved to MongoDB user ${user.email}`);

        return res.status(200).json({
            success: true,
            message: "Profile photo uploaded and saved successfully.",
            profileImage: imageUrl,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImage: imageUrl,
                bio: user.bio || ""
            }
        });

    } catch (error) {
        console.error("Error in uploadProfileImage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload image."
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, name, bio, profileImage } = req.body;
        const user = await resolveUser(email, req);

        if (name && typeof name === 'string' && name.trim()) {
            const parts = name.trim().split(" ");
            user.firstName = parts[0] || user.firstName;
            user.lastName = parts.slice(1).join(" ") || user.lastName;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (profileImage) {
            user.profileImage = profileImage;
        }

        await user.save();
        await User.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bio: user.bio,
                    profileImage: user.profileImage 
                } 
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio || "",
                profileImage: user.profileImage || ""
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile."
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const email = req.query?.email || req.body?.email;
        const user = await resolveUser(email, req);

        return res.status(200).json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio || "",
                profileImage: user.profileImage || ""
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get profile."
        });
    }
};
