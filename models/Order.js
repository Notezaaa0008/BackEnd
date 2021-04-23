module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        trackingNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        fullNameSender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressSender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        districtSender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        provinceSender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countrySender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        postalCodeSender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone1Sender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone2Sender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fullNameReceiver: {
            type: DataTypes.STRING,
            allowNull: false
        },
        addressReceiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        districtReceiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provinceReceiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        countryReceiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postalCodeReceiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone1Receiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone2Receiver: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pickUpDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
        {
            timestamps: false,
            underscored: true
        }
    );

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: true,

            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });

        Order.hasMany(models.Status, {
            foreignKey: {
                name: 'orderId',
                allowNull: false,
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Order;
}