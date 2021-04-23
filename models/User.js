module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        role: {
            type: DataTypes.ENUM,
            values: ['ADMIN', 'CUSTOMER'],
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pictureProfileUser: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        districtUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provinceUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        countryUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postalCodeUser: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone1User: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone2User: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }

    },
        {
            underscored: true
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Order, {
            foreignKey: {
                name: 'userId',
                allowNull: true
            },
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
        });
    };

    return User;
}