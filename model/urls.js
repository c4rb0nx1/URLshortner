const {DataTypes} = require('sequelize')

module.exports = (sequilize) => {
    const urls = sequilize.define('urls', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        parentURL:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        shortURL:{
            type:DataTypes.STRING,
            allowNull: true
        },
        customAlias:{
            type: DataTypes.STRING,
            allowNull:true
        },
        userID:{
            type: DataTypes.INTEGER,
            references: {
                model: 'users', 
                key: 'id' 
            },
            onDelete: 'CASCADE',
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        tableName: 'urls',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
})
    return urls
}