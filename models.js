const sequelize = require('./database')
const {DataTypes} = require('sequelize')

const Users = sequelize.define('vk_users',
    {
        id: {type: DataTypes.INTEGER, unique: true, primaryKey: true},
        new: {type: DataTypes.BOOLEAN, defaultValue: false},
        drafts: {type: DataTypes.BOOLEAN, defaultValue: false},
        templates: {type: DataTypes.BOOLEAN, defaultValue: false},
        updates: {type: DataTypes.BOOLEAN, defaultValue: false},
        off_topic: {type: DataTypes.BOOLEAN, defaultValue: false},
        opinions: {type: DataTypes.BOOLEAN, defaultValue: false},
        republications: {type: DataTypes.BOOLEAN, defaultValue: false},
        stuff: {type: DataTypes.BOOLEAN, defaultValue: false}
    })
const Admins = sequelize.define('admins',
    {
            id: {type: DataTypes.INTEGER, unique: true, primaryKey: true}
    })

module.exports = {
        Users,
        Admins
}