const {DataTypes, TableHints} = require('sequelize')
module.exports = (sequelize) => {
    const session = sequelize.define('session',{
        sessionID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            alloNull:false
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
        bearer_token:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        JWTtoken:{
            type:DataTypes.TEXT,
            alloNull: true, //for now we making this to be null and also JWT is not gen yet, also secret is not declared yet.
        }

    },
{
    tableName: 'session',
    timestampls: true,
    createdAt: ' created_at',
    updatedAt:'updated_at'

})
    return session
}