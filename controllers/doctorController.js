const doctorProfileModel = require("../models/doctorProfile")
const userModel = require("../models/user")

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
//  It just makes sure the string is a properly formatted 24-hour time

const convert = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

function minutesToTime(totalMinutes) {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const m = (totalMinutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
}


async function completeProfile(req, res) {
    try {

        const {
            specialization,
            experience,
            hospital,
            education,
            licenseNumber,
            consultationFee,
            availability
        } = req.body;

        const user = req.user;

        if (user.isProfileCompleted === true) {
            return res.status(409).json({
                status: false,
                message: "Profile already exists"
            });
        }

        if (
            !specialization ||
            !hospital ||
            !education ||
            !licenseNumber ||
            consultationFee === undefined ||
            consultationFee === null
        ) {
            return res.status(400).json({
                status: false,
                message: "All required fields are mandatory"
            });
        }

        if (experience === undefined || experience === null) {
            return res.status(400).json({
                status: false,
                message: "Experience is required"
            });
        }

        // Validate availability
        if (!Array.isArray(availability) || availability.length === 0) {
            // Checking that the availability is in form of array
            return res.status(400).json({
                status: false,
                message: "At least one availability slot is required"
            });
        }

        // Validate each slot and convert times to numbers (since schema expects Number)
        const formattedAvailability = [];

        for (const slot of availability) {

            if (!slot.day || !TIME_REGEX.test(slot.startTime) || !TIME_REGEX.test(slot.endTime)) {
                return res.status(400).json({
                    status: false,
                    message: "Each slot needs a valid day, startTime and endTime (HH:MM)"
                });
            }

            const start = convert(slot.startTime);
            const end = convert(slot.endTime);

            if (start >= end) {
                return res.status(400).json({
                    status: false,
                    message: "Start time must be less than end time"
                });
            }

            formattedAvailability.push({
                day: slot.day,
                startTime: start,
                endTime: end
            });
        }

        await doctorProfileModel.create({
            userId: req.user._id,
            specialization,
            experience,
            hospital,
            education,
            licenseNumber,
            consultationFee,
            availability: formattedAvailability
        });

        await userModel.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    isProfileCompleted: true
                }
            }
        );

        return res.status(201).json({
            status: true,
            message: "Profile completed successfully"
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}

async function updateProfile(req, res) {
    try {
        const { specialization, experience, hospital, education, consultationFee, availability } = req.body

        const updateData = {}

        if (specialization) {
            updateData.specialization = specialization
        }
        if (experience !== undefined && experience !== null) {
            updateData.experience = experience
        }
        if (hospital) {
            updateData.hospital = hospital
        }
        if (education) {
            updateData.education = education
        }
        if (consultationFee !== undefined && consultationFee !== null) {
            updateData.consultationFee = consultationFee
        }

        if (availability) {

            if (!Array.isArray(availability) || availability.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "At least one availability slot is required"
                });
            }

            const formattedAvailability = [];

            for (const slot of availability) {

                if (!slot.day || !TIME_REGEX.test(slot.startTime) || !TIME_REGEX.test(slot.endTime)) {
                    return res.status(400).json({
                        status: false,
                        message: "Each slot needs a valid day, startTime and endTime (HH:MM)"
                    });
                }

                const start = convert(slot.startTime);
                const end = convert(slot.endTime);

                if (start >= end) {
                    return res.status(400).json({
                        status: false,
                        message: "Start time must be less than end time"
                    });
                }

                formattedAvailability.push({
                    day: slot.day,
                    startTime: start,
                    endTime: end
                });
            }

            updateData.availability = formattedAvailability;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: false,
                message: "No fields provided to update profile"
            })
        }

        const updatedProfile = await doctorProfileModel.findOneAndUpdate(
            { userId: req.user._id },
            updateData,
            { new: true }
        );

        return res.status(200).json({
            updatedProfile,
            status: true,
            message: "Profile is updated"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function dashboardPage(req, res) {
    try {

        const doctor = req.user;
        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found"
            })
        }
        return res.status(200).render("doctor/dashboard", {
            doctor,
            status: true,
            message: "user is logged in"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function completeProfileGet(req, res) {
    try {
        return res.status(200).render("doctor/profile", {
            status: true,
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function getProfileForUpdate(req, res) {
    try {
        const profile = await doctorProfileModel.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).render("error", {
                message: "Profile not found. Please complete your profile first."
            });
        }

        // Convert minutes-since-midnight back to "HH:MM" for the form
        const availability = profile.availability.map(slot => ({
            day: slot.day,
            startTime: minutesToTime(slot.startTime),
            endTime: minutesToTime(slot.endTime)
        }));

        return res.render("doctor/updateDoctorProfile", {
            profile: {
                specialization: profile.specialization || "",
                experience: profile.experience || 0,
                hospital: profile.hospital || "",
                education: profile.education || "",
                consultationFee: profile.consultationFee || 0,
                availability
            }
        });

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

module.exports = {
    completeProfile, updateProfile, dashboardPage, completeProfileGet,getProfileForUpdate
}
