require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');
const middleware = require('./middlewares/error');

const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const statusRoute = require('./routes/statusRoute');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());
app.use('/users', userRoute);
app.use('/orders', orderRoute);
app.use('/status', statusRoute);


app.use((req, res, next) => {
    res.status(404).json({ message: "Path not found in this server, please make sure that your path or method is correct." });
});

app.use(middleware);

// sequelize.sync({ force: true }).then(() => console.log('DB sync'))

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`This server is running on ${port}`));