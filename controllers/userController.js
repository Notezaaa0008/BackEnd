const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.getProFileUser = async (req, res, next) => {
    try {
        const profile = await User.findOne({
            where: { id: req.user.id },
            attributes: ['firstName', 'lastName', 'email', 'addressUser', 'districtUser', 'provinceUser', 'countryUser',
                'postalCodeUser', 'phone1User', 'phone2User', 'pictureProfileUser']
        })
        res.status(200).json({ profile });
    } catch (err) {
        next(err);
    }
};


exports.register = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const {
            username, firstName, lastName,
            email, password, confirmPassword, addressUser,
            districtUser, provinceUser, countryUser,
            postalCodeUser, phone1User, phone2User, role
        } = req.body;
        if (username === undefined) return res.status(400).json({ message: 'Username is required.' });
        if (firstName === undefined) return res.status(400).json({ message: 'FirstName is required.' });
        if (lastName === undefined) return res.status(400).json({ message: 'LastName is required.' });
        if (addressUser === undefined) return res.status(400).json({ message: 'AddressUser is required.' });
        if (districtUser === undefined) return res.status(400).json({ message: 'DistrictUser is required.' });
        if (provinceUser === undefined) return res.status(400).json({ message: 'ProvinceUser is required.' });
        if (countryUser === undefined) return res.status(400).json({ message: 'CountryUser is required.' });
        if (postalCodeUser === undefined) return res.status(400).json({ message: 'PostalCodeUser is required.' });
        if (phone1User === undefined) return res.status(400).json({ message: 'Phone is required.' });
        if (role === undefined) return res.status(400).json({ message: 'Role is required.' });
        if (role !== 'ADMIN' && role !== 'CUSTOMER') return res.status(400).json({ message: 'Role not found.' });
        if (email === undefined) return res.status(400).json({ message: 'Email is required.' });
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return res.status(400).json({ message: 'Invalid email address.' })
        };
        if (password === undefined) return res.status(400).json({ message: 'password is required' });
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))) {
            return res.status(400).json({ message: 'Password must contain at least eight but not more than fifteen characters, Which contain at least one uppercase letters, lowercase letters, numbers, and special characters.' })
        }
        if (confirmPassword === undefined) return res.status(400).json({ message: 'confirmPassword is required' });
        if (password !== confirmPassword) return res.status(400).json({ message: 'password did not match' });
        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
        let user;
        if (req.file) {
            const secure_url = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
                if (err) return next(err);

                fs.unlinkSync(req.file.path);
                return result.secure_url
            });
            user = await User.create({
                pictureProfileUser: secure_url.secure_url, username, firstName, lastName,
                email, password: hashedPassword, addressUser,
                districtUser, provinceUser, countryUser,
                postalCodeUser, phone1User, phone2User, role
            }, { transaction: trans });
        } else if (!req.file) {
            user = await User.create({
                username, firstName, lastName,
                email, password: hashedPassword, addressUser,
                districtUser, provinceUser, countryUser,
                postalCodeUser, phone1User, phone2User, role
            }, { transaction: trans });
        }

        // console.log(user)
        const payload = { id: user.id, username, email, firstName, lastName, role };
        let ex = process.env.JWT_EXPIRES_IN.split('*');
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ex[0] * ex[1] * ex[2] * ex[3] });
        await trans.commit();
        res.status(201).json({ token, role });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (username === undefined) return res.status(400).json({ message: 'username is required' });
        if (password === undefined) return res.status(400).json({ message: 'password is required' });
        const user = await User.findOne({
            where: { username }
        })
        if (!user) {
            return res.status(400).json({ message: 'username and password incorrect' })
        }
        const isPasswordMath = await bcrypt.compare(password, user.password);
        if (!isPasswordMath) {
            return res.status(400).json({ message: 'username and password incorrect' })
        }

        const payload = {
            id: user.id, firstName: user.firstName, lastName: user.lastName,
            username: user.username, role: user.role
        }
        let ex = process.env.JWT_EXPIRES_IN.split('*');
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ex[0] * ex[1] * ex[2] * ex[3] })
        res.status(200).json({ token, role: user.role, message: 'login successfully' });
    } catch (err) {
        next(err);
    }
};

exports.editProFileUser = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        let { firstName, lastName,
            email, addressUser, districtUser, provinceUser, countryUser,
            postalCodeUser, phone1User, phone2User } = req.body;
        if (firstName === undefined) {
            let first = await User.findOne({
                where: { id: req.user.id },
                attributes: ['firstName']
            });
            firstName = first.firstName;
        };
        if (lastName === undefined) {
            let last = await User.findOne({
                where: { id: req.user.id },
                attributes: ['lastName']
            });
            lastName = last.lastName;
        };
        if (addressUser === undefined) {
            let address = await User.findOne({
                where: { id: req.user.id },
                attributes: ['addressUser']
            });
            addressUser = address.addressUser;
        };
        if (districtUser === undefined) {
            let district = await User.findOne({
                where: { id: req.user.id },
                attributes: ['districtUser']
            });
            districtUser = district.districtUser;
        };
        if (provinceUser === undefined) {
            let province = await User.findOne({
                where: { id: req.user.id },
                attributes: ['provinceUser']
            });
            provinceUser = province.provinceUser
        };
        if (countryUser === undefined) {
            let country = await User.findOne({
                where: { id: req.user.id },
                attributes: ['countryUser']
            });
            countryUser = country.countryUser;
        };
        if (postalCodeUser === undefined) {
            let postalCode = await User.findOne({
                where: { id: req.user.id },
                attributes: ['postalCodeUser']
            });
            postalCodeUser = postalCode.postalCodeUser;
        };
        if (phone1User === undefined) {
            let phone = await User.findOne({
                where: { id: req.user.id },
                attributes: ['phone1User']
            });
            phone1User = phone.phone1User;
        };

        if (email === undefined) {
            let mail = await User.findOne({
                where: { id: req.user.id },
                attributes: ['email']
            });
            email = mail.email;
        };

        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return res.status(400).json({ message: 'email' })
        };

        if (req.file) {
            const secure_url = await cloudinary.uploader.upload(req.file.path, async (err, result) => {
                if (err) return next(err);
                fs.unlinkSync(req.file.path);
                return result.secure_url
            });
            await User.update({
                pictureProfileUser: secure_url.secure_url, firstName, lastName, email, addressUser, districtUser, provinceUser, countryUser,
                postalCodeUser, phone1User, phone2User
            }, { where: { id: req.user.id } },
                { transaction: trans });
        } else if (!req.file) {
            await User.update({
                firstName, lastName, email, addressUser, districtUser, provinceUser, countryUser,
                postalCodeUser, phone1User, phone2User
            }, { where: { id: req.user.id } },
                { transaction: trans });
        }

        await trans.commit();
        res.status(200).json({ message: 'Edit successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { newPassword, confirmNewPassword } = req.body;
        if (newPassword === undefined) return res.status(400).json({ message: 'password is required' });
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))) {
            return res.status(400).json({ message: 'Password must contain at least eight but not more than fifteen characters, Which contain at least one uppercase letters, lowercase letters, numbers, and special characters.' })
        }
        if (confirmNewPassword === undefined) return res.status(400).json({ message: 'password is required' });
        if (newPassword !== confirmNewPassword) return res.status(400).json({ message: 'password did not match' });
        const hashedNewPassword = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT);
        await User.update({ password: hashedNewPassword },
            { where: { id: req.user.id } },
            { transaction: trans });
        await trans.commit();
        res.status(200).json({ message: 'Change password successfully' });
    } catch (err) {
        await trans.rollback();
        next(err)
    }
};






