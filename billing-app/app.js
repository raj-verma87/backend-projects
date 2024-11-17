const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const Product = require('./models/Product');
const Category = require('./models/Category');
const productRoutes = require('./routes/product');
const categoryRoute = require('./routes/category');

const app = express();
app.use(bodyParser.json());

app.use('/api/products', productRoutes);
app.use('/api/Categories', categoryRoute);

// Set up relationships
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Sync models with the database
// sequelize.sync({ force: true })
//   .then(() => console.log("Tables created successfully"))
//   .catch(err => console.error("Error creating tables: ", err));


module.exports = app;
