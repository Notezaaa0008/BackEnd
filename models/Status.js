module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define('Status', {
        status: {
            type: DataTypes.ENUM,
            values: ['SENDER IS PREPARING PACKAGE', 'SHIPMENT DROP OFF', 'SHIPMENT PICK UP', 'ARRIVED AT TRANSIT STATION',
                'ARRIVED AT DESTINATION STATION', 'OUT FOR DELIVERY', 'DELIVERY UNSUCCESSFUL DUE TO CANNOT CONTACT',
                'DELIVERY SUCCESSFULLY', 'CANCEL'],
            allowNull: false
        },
        statusUpdateTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        reasonForCancellation: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        assign: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
        {
            timestamps: false,
            underscored: true
        }
    );

    Status.associate = (models) => {
        Status.belongsTo(models.Order, {
            foreignKey: {
                name: 'orderId',
                allowNull: false,
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return Status;
}