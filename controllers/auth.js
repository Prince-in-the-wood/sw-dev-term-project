const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
        const { name, telNo, email, password, role } = req.body;

        const user = await User.create({
            name,
            telNo,
            email,
            password,
            role
        });

        const token = user.getSignedJwtToken();

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false });
    }
}