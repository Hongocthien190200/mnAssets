const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const path = require('path');

const app = express();

const asset = require('./src/routes/asset');
const assetCategory = require('./src/routes/assetcategory');
const location = require('./src/routes/location');
const maintenance = require('./src/routes/maintenance');
const reminder = require('./src/routes/reminder');
const stranfer = require('./src/routes/stranfer');
const stranferAsset = require('./src/routes/transferasset');
const authen = require('./src/routes/auth');

// const { startCron} = require('./src/service/notification');

dotenv.config();
mongoose.connect(process.env.CONNECT_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('CONNECT TO MONGODB');
    })
    .catch(err => console.log(err));
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan('combined'));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));


app.use("/api", asset);
app.use("/api", assetCategory);
app.use("/api", location);
app.use("/api", maintenance);
app.use("/api", reminder);
app.use("/api", stranferAsset);
app.use("/api", authen);

// startCron();

//Khởi chạy
app.listen(port, () => {
    console.log(`Server is Running on ${port}`);
})

