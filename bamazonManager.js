// ### Challenge #2: Manager View (Next Level)
//
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
//
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
//
//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
//
// - - -

var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection to sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "steamboat11",
  database: "bamazon"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // Run function here

  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale",
                  "View Low Inventory",
                  "Add to Inventory",
                  "Add New Product"]
      },
    ])
    .then(function(answer) {
      // For testing/debugging
      // console.log(answer);
      switch (answer.action) {
        case "View Products for Sale": displayProducts();
          break;
        case "View Low Inventory": viewLowInventory();
          break;
      }
    });


});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // For testing/debugging:
    // console.log(results);
    console.log("ALL ITEMS FOR SALE:");
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
    }
  });
}

function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
    if (err) throw err;
    // For testing/debugging:
    // console.log(results);
    console.log("ITEMS WITH LOW QUANTITY:");
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
    }
  });
}
