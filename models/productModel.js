module.exports = (sequelize, DataTypes) => {


    const Product = sequelize.define("product", {

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING
        }
    })

    return Product
}