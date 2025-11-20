const path = require("path");
const route = require("./routes");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 4001;

const whitelist = [process.env.UI_LOCAL_ENDPOINT, process.env.UI_PROD_ENDPOINT];
const corsOptions = {
  origin: function (origin, callback) {
    if (origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// Tăng giới hạn cho JSON body
app.use(express.json({ limit: "50mb" }));

app.use(cors(corsOptions));

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Static file
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "utils")));

route(app);

app.listen(port, () => console.log(`App is listening at port ${port}`));
