const { Status, Order, User, sequelize } = require('../models');
const { Op } = require('sequelize');


exports.getStatus = async (req, res, next) => {
    try {
        const order = req.order;
        const userId = await User.findOne({
            where: { id: order.userId },
            attributes: ['id', 'firstName', 'lastName', 'email', 'addressUser',
                'districtUser', 'provinceUser', 'countryUser',
                'postalCodeUser', 'phone1User', 'phone2User']
        });
        const status = await Status.findAll({
            where: { orderId: order.id },
            order: [['statusUpdateTime', 'DESC']]
        });
        if (status) {
            order.dataValues["userId"] = userId;
            order.dataValues["status"] = status;
        };
        res.status(200).json({ order });
    } catch (err) {
        next(err);
    }
};

exports.getStatusListByUser = async (req, res, next) => {
    try {
        const { param } = req.params;
        let orderList = req.orderList;
        let orderTmp = [];
        for (let index = 0; index < orderList.length; index++) {
            const item = orderList[index];
            const userId = await User.findOne({
                where: { id: item.userId },
                attributes: ['id', 'firstName', 'lastName', 'email', 'addressUser',
                    'districtUser', 'provinceUser', 'countryUser',
                    'postalCodeUser', 'phone1User', 'phone2User']
            });
            const status = await Status.findAll({ where: { orderId: item.id }, order: [['statusUpdateTime', 'DESC']] });
            if (status) {
                item.dataValues["userId"] = userId;
                item.dataValues["status"] = status;
            }
            if (param === 'all') {
                orderTmp.push(item);
            } else if (param === 'transit' && status) {
                let statusVerify = status.filter(s => {
                    return (s.status === 'DELIVERY SUCCESSFULLY' || s.status === 'CANCEL')
                })
                if (statusVerify.length <= 0) {
                    orderTmp.push(item);
                }
            } else if (param === 'successful' && status) {
                let statusVerify = status.filter(s => {
                    return s.status === 'DELIVERY SUCCESSFULLY'
                })
                if (statusVerify.length > 0) {
                    orderTmp.push(item);
                }
            } else if (param === 'cancel' && status) {
                let statusVerify = status.filter(s => {
                    return s.status === 'CANCEL'
                })
                if (statusVerify.length > 0) {
                    orderTmp.push(item);
                }
            }
            //ค่าของ orderList ถูกเก็บไว้ใน dataValues ตอนปริ้น orderList ออกมาดู

        };
        res.status(200).json({ orderTmp });

    } catch (err) {
        next(err);
    }
};

exports.getStatusListAll = async (req, res, next) => {
    try {
        const { param } = req.params;
        const orderListAll = req.orderListAll;
        let orderTmp = [];
        for (let index = 0; index < orderListAll.length; index++) {
            const item = orderListAll[index];
            const userId = await User.findOne({
                where: { id: item.userId },
                attributes: ['id', 'firstName', 'lastName', 'email', 'addressUser',
                    'districtUser', 'provinceUser', 'countryUser',
                    'postalCodeUser', 'phone1User', 'phone2User']
            });
            const status = await Status.findAll({ where: { orderId: item.id }, order: [['statusUpdateTime', 'DESC']] });
            //ค่าของ orderList ถูกเก็บไว้ใน dataValues ตอนปริ้น orderList ออกมาดู
            if (status) {
                item.dataValues["userId"] = userId;
                item.dataValues["status"] = status;
            };
            if (param === 'all') {
                orderTmp.push(item);
            } else if (param === 'transit' && status) {
                let statusVerify = status.filter(s => {
                    return (s.status === 'DELIVERY SUCCESSFULLY' || s.status === 'CANCEL')
                })
                if (statusVerify.length <= 0) {
                    orderTmp.push(item);
                }
            } else if (param === 'successful' && status) {
                let statusVerify = status.filter(s => {
                    return s.status === 'DELIVERY SUCCESSFULLY'
                })
                if (statusVerify.length > 0) {
                    orderTmp.push(item);
                }
            } else if (param === 'cancel' && status) {
                let statusVerify = status.filter(s => {
                    return s.status === 'CANCEL'
                })
                if (statusVerify.length > 0) {
                    orderTmp.push(item);
                }
            }
        };
        res.status(200).json({ orderTmp })
    } catch (err) {
        next(err);
    }
}

exports.createStatus = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { status } = req.body;
        if (status === undefined) return res.status(400).json({ message: 'Status is required' });
        await Status.create({
            orderId: req.order.id, status, statusUpdateTime: new Date()
        },
            { transaction: trans });

        await trans.commit();
        res.status(201).json({ message: 'Create status successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    const trans = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, reasonForCancellation, assign } = req.body;
        if (status === undefined) return res.status(400).json({ message: 'Status is required' });
        if (status === 'CANCEL') {
            if (reasonForCancellation === undefined) return res.status(400).json({ message: 'Reason for cancellation is required' });
            if (assign === undefined) return res.status(400).json({ message: 'Assign is required' });
        }
        await Status.create({
            orderId: id, status, statusUpdateTime: new Date(),
            reasonForCancellation, assign
        },
            { transaction: trans });
        await trans.commit();
        res.status(200).json({ message: 'Update status successfully' });
    } catch (err) {
        await trans.rollback();
        next(err);
    }
};

exports.deleteStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Status.destroy({ where: { orderId: id } });
        next()
        // res.status(200).json({ message: 'Delete successfully' });
    } catch (err) {
        next(err);
    }
};