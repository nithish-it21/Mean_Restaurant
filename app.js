var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
const User = require("./model/User");
const Reservation = require("./model/Reservation");

const Order = require('./model/Order');
const CartItem = require("./model/CartItem");


var app = express();
const mime = require('mime');

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (mime.getType(path) === 'text/css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

const uri = 'mongodb://127.0.0.1:27017/mydatabase'; // Replace 'mydatabase' with your desired database name

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start your application or perform further operations
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    // Handle connection error
  });

  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
  
// Showing secret page
app.get("/index", isLoggedIn, function (req, res) {
    res.render("index");
});
  
app.get("/thank-you", (req, res) => {
  res.render("thank-you");
});

// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/reservation", function (req, res) {
  res.render("reservation");
});
 


app.post("/reservation", async (req, res) => {
  const { booking_date, Session } = req.body;

  let mystring; 
  
  try {
    const existingReservation = await Reservation.findOne({ table: req.body.total_tables, class: req.body.Cls, date: booking_date, time: Session });
    // Declare the mystring variable in the appropriate scope

    if (existingReservation) {
      mystring = "Table is already booked"; // Assign a value to mystring
      res.render("reservation", { mystring: mystring, delay: true });
    } else {
      const reservation = await Reservation.create({
        name: req.body.full_name,
        phone: req.body.phone_number,
        table: req.body.total_tables,
        class: req.body.Cls,
        date: booking_date,
        time: Session,
      });
      mystring = "Reservation successful"; // Assign a value to mystring
      res.render("reservation", { mystring: mystring, delay: true });
    }
  } catch (error) {
    mystring = "An error occurred while processing the reservation"; // Assign a value to mystring in case of an error
    res.render("reservation", { mystring: mystring, delay: true });
  }
});


app.post("/order", async (req, res) => {
  try {
    const order = await Order.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    });
    
    // Redirect to the thank-you page or any other desired page
    return res.redirect("/thank-you");
  } catch (error) {
    // Handle error if the order creation fails
    console.error(error);
    return res.status(500).send("Error creating order.");
  }
});



// Handling user signup
app.post("/register", async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    });
    
    return res.redirect("/login");

  });
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});

// Showing form page

// Handling user login
app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      // check if password matches
      const result = req.body.password === user.password;
      if (result) {
        // Successful login
        res.render("index");
      } else {
        // Password doesn't match
        res.render("login", { error: "Password doesn't match", authenticated: false });
      }
    } else {
      res.render("login", { error: "User doesn't exist", authenticated: false });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});



//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
  
  
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// GET route to render the cart page




app.get('/cart', async function(req, res) {
  try {
    // Fetch the cart items from the database
    const cartItems = await CartItem.find().exec();

    // Render the cart.ejs template and pass the cart items data to it
    res.render('cart', { cartItems: cartItems });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to retrieve cart items.');
  }
});


app.post('/cart', async function(req, res) {
  const { name, price } = req.body;

  try {
    const newItem = new CartItem({
      name: name,
      price: price
    });

    await newItem.save();
    res.redirect('/cart'); // Redirect to the cart page after adding the item
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add item to cart.');
  }
});

// Delete a cart item
app.delete('/cart/:id', async function(req, res) {
  const itemId = req.params.id;

  try {
    // Find the cart item by ID and remove it from the database
    await CartItem.findByIdAndRemove(itemId).exec();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete cart item.');
  }
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
