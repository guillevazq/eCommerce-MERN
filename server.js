const config = require("./config/secrets");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
mongoose.connect(config.databaseURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () => console.log("Connected to database succesfully"));
app.use(express.json());

app.get("/", (request, response) => response.json({message: "Welcome to the eCommerce API"}));

// Account Routes
app.use("/register", require("./routes/accounts/register"));
app.use("/login", require("./routes/accounts/login"));
app.use("/accounts/get-all", require("./routes/accounts/account-crud/get"));
app.use("/accounts/edit-current", require("./routes/accounts/account-crud/edit"));
app.use("/accounts/delete-current", require("./routes/accounts/account-crud/delete"));

// Product Routes
app.use("/post-item", require("./routes/items/post"));
app.use("/get-item", require("./routes/items/get"));
app.use("/edit-item", require("./routes/items/edit"));
app.use("/delete", require("./routes/items/delete"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));