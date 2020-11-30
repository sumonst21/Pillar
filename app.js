const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;
const passport = require('passport');
const mongoose = require('mongoose');
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const users = require("./routes/api/users");
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/users", users);
