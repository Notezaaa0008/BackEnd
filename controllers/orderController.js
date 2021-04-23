const { Order, sequelize } = require('../models');
const moment = require('moment');



exports.searchOrder = async (req, res, next) => {
    try {
        const { trackingNumber } = req.params;
        console.log(trackingNumber)
        const order = await Order.findOne({
            where: { trackingNumber }
        });
        if (!order) return res.status(400).json({ message: "Tracking number not found" });
        req.order = order;
        next();
    } catch (err) {
        next(err);
    }
};

exports.getListOrderByUser = async (req, res, next) => {
    try {
        const orderList = await Order.findAll({
            where: { userId: req.user.id }
        })
        // console.log(JSON.parse(JSON.stringify(orderList)))
        req.orderList = orderList;
        next();
    } catch (err) {
        next(err);
    }
};

exports.getListOrderByAll = async (req, res, next) => {
    try {
        const orderListAll = await Order.findAll();
        req.orderListAll = orderListAll;
        next();
    } catch (err) {
        next(err);
    }
}


function createNumber(num) {
    num = `${+num + 1}`;
    num = (num.padStart(9, "0"));
    return num;
}

exports.createOrder = async (req, res, next) => {
    try {
        let { fullNameSender, addressSender, districtSender,
            provinceSender, countrySender, postalCodeSender,
            phone1Sender, phone2Sender, fullNameReceiver, addressReceiver, districtReceiver,
            provinceReceiver, countryReceiver, postalCodeReceiver,
            phone1Receiver, phone2Receiver, pickUpDate } = req.body;
        let track = await Order.max('trackingNumber');
        let num;
        if (!track) {
            num = "";
        } else {
            num = track.slice(2);
        }
        if (req.user.role === "ADMIN") {
            if (fullNameSender === undefined) return res.status(400).json({ message: 'Full name sender is required' });
            if (addressSender === undefined) return res.status(400).json({ message: 'Address sender is required' });
            if (districtSender === undefined) return res.status(400).json({ message: 'District sender is required' });
            if (provinceSender === undefined) return res.status(400).json({ message: 'Province sender is required' });
            if (countrySender === undefined) return res.status(400).json({ message: 'Country sender is required' });
            if (postalCodeSender === undefined) return res.status(400).json({ message: 'Postal code sender is required' });
            if (phone1Sender === undefined) return res.status(400).json({ message: 'Phone1 sender is required' });
            if (fullNameReceiver === undefined) return res.status(400).json({ message: 'Full name receiver is required' });
            if (addressReceiver === undefined) return res.status(400).json({ message: 'Address receiver is required' });
            if (districtReceiver === undefined) return res.status(400).json({ message: 'District receiver is required' });
            if (provinceReceiver === undefined) return res.status(400).json({ message: 'Province receiver is required' });
            if (countryReceiver === undefined) return res.status(400).json({ message: 'Country receiver is required' });
            if (postalCodeReceiver === undefined) return res.status(400).json({ message: 'Postal code receiver is required' });
            if (phone1Receiver === undefined) return res.status(400).json({ message: 'Phone1 receiver is required' });
            num = createNumber(num)
            let trackingNumber = "TE" + num;
            pickUpDate = moment().toDate();
            const holiday = {
                "01/01/2021": "NewYear\'s Day", "12/02/2021": "Chinese New Year", "26/01/2021": "Makha Bucha", "06/04/2021": "Chakri Day",
                "12/04/2021": "Songkran", "13/04/2021": "Songkran", "14/04/2021": "Songkran", "15/01/2021": "Songkran",
                "04/05/2021": "H.M. King\'s Coronation", "10/05/2021": "Royal Ploughing Ceremony", "26/05/2021": "Visakha Bucha Day", "03/06/2021": "H.M. Queen\'s Birthday",
                "26/07/2021": "Asahna Bucha Day", "27/07/2021": "Buddhist Lent", "28/07/2021": "H.M. King\'s Birthday", "12/08/2021": "H.M. Queen Mother's Birthday",
                "24/09/2021": "Prince Mahidol Day", "13/10/2021": "The Passing of King Bhumibol", "22/10/2021": "Chulalongkorn Day", "06/12/2021": "King Bhumibol\'s Birthday",
                "10/12/2021": "Thailand Constitution Day", "31/12/2021": "New Year\'s Eve"
            }
            let date = moment(pickUpDate, "DD/MM/YYYY").format("MM.DD.YYYY");
            if (moment(date).format("E") === "5") {
                date = moment(date).add(2, "days");
                if (moment(date).format("E") === "7") {
                    date = moment(date).add(1, "days");
                }
            } else if (moment(date).format("E") === "6") {
                date = moment(date).add(1, "days");
                if (moment(date).format("E") === "7") {
                    date = moment(date).add(2, "days");
                }
            } else {
                date = moment(date).add(2, "days");
            }
            let checkDate = `${("0" + (new Date(date).getDate())).slice(-2)}/${("0" + (new Date(date).getMonth() + 1)).slice(-2)}/${(new Date(date).getFullYear())}`;
            while (holiday[checkDate]) {
                date = moment(date).add(1, "days");
                checkDate = `${("0" + (new Date(date).getDate())).slice(-2)}/${("0" + (new Date(date).getMonth() + 1)).slice(-2)}/${(new Date(date).getFullYear())}`;
            }
            let dueDate = moment(date).toDate();
            const order = await Order.create({
                fullNameSender, addressSender, districtSender,
                provinceSender, countrySender, postalCodeSender,
                phone1Sender, phone2Sender, fullNameReceiver, addressReceiver, districtReceiver,
                provinceReceiver, countryReceiver, postalCodeReceiver,
                phone1Receiver, phone2Receiver, pickUpDate, dueDate, trackingNumber
            });
            req.order = order;
            next()
        } else if (req.user.role === "CUSTOMER") {
            if (pickUpDate === undefined) return res.status(400).json({ message: 'Pickup date is required' });
            if (fullNameReceiver === undefined) return res.status(400).json({ message: 'Full name receiver is required' });
            if (addressReceiver === undefined) return res.status(400).json({ message: 'Address receiver is required' });
            if (districtReceiver === undefined) return res.status(400).json({ message: 'District receiver is required' });
            if (provinceReceiver === undefined) return res.status(400).json({ message: 'Province receiver is required' });
            if (countryReceiver === undefined) return res.status(400).json({ message: 'Country receiver is required' });
            if (postalCodeReceiver === undefined) return res.status(400).json({ message: 'Postal code receiver is required' });
            if (phone1Receiver === undefined) return res.status(400).json({ message: 'Phone1 receiver is required' });
            num = createNumber(num)
            let trackingNumber = "TE" + num;
            const holiday = {
                "01/01/2021": "NewYear\'s Day", "12/02/2021": "Chinese New Year", "26/01/2021": "Makha Bucha", "06/04/2021": "Chakri Day",
                "12/04/2021": "Songkran", "13/04/2021": "Songkran", "14/04/2021": "Songkran", "15/04/2021": "Songkran",
                "04/05/2021": "H.M. King\'s Coronation", "10/05/2021": "Royal Ploughing Ceremony", "26/05/2021": "Visakha Bucha Day", "03/06/2021": "H.M. Queen\'s Birthday",
                "26/07/2021": "Asahna Bucha Day", "27/07/2021": "Buddhist Lent", "28/07/2021": "H.M. King\'s Birthday", "12/08/2021": "H.M. Queen Mother's Birthday",
                "24/09/2021": "Prince Mahidol Day", "13/10/2021": "The Passing of King Bhumibol", "22/10/2021": "Chulalongkorn Day", "06/12/2021": "King Bhumibol\'s Birthday",
                "10/12/2021": "Thailand Constitution Day", "31/12/2021": "New Year\'s Eve"
            }
            let date = moment(pickUpDate, "YYYY/MM/DD").format("MM.DD.YYYY");
            console.log(date + "mmmmm")
            if (moment(date).format("E") === "5") {
                date = moment(date).add(2, "days");
                if (moment(date).format("E") === "7") {
                    date = moment(date).add(1, "days");
                }
            } else if (moment(date).format("E") === "6") {
                date = moment(date).add(1, "days");
                if (moment(date).format("E") === "7") {
                    date = moment(date).add(2, "days");
                }
            } else {
                date = moment(date).add(2, "days");
            }
            let checkDate = `${("0" + (new Date(date).getDate())).slice(-2)}/${("0" + (new Date(date).getMonth() + 1)).slice(-2)}/${(new Date(date).getFullYear())}`;
            while (holiday[checkDate]) {
                date = moment(date).add(1, "days");
                checkDate = `${("0" + (new Date(date).getDate())).slice(-2)}/${("0" + (new Date(date).getMonth() + 1)).slice(-2)}/${(new Date(date).getFullYear())}`;
            }
            let dueDate = moment(date).toDate();

            const order = await Order.create({
                fullNameReceiver, addressReceiver, districtReceiver,
                provinceReceiver, countryReceiver, postalCodeReceiver,
                phone1Receiver, phone2Receiver, pickUpDate, dueDate, trackingNumber, userId: req.user.id
            });
            req.order = order;
            next()
        }
    } catch (err) {
        next(err);
    }
};



exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Order.destroy({ where: { id } });
        res.status(200).json({ message: 'Delete successfully' });
    } catch (err) {
        next(err);
    }
};