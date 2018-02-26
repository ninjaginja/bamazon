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
  // Run displayProducts function to show all items available for sale (ids, names, prices)
  displayProducts();

  setTimeout(function(){
    placeOrder();
  }, 500);
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // For testing/debugging:
    // console.log(results);
    console.log("ITEMS FOR SALE:");
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price);
    }
  });
}


// function which prompts the user for item details
function placeOrder() {
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
      },
      {
        name: "units",
        type: "input",
        message: "How many units of this product would you like to purchase?"
      }
    ])
    .then(function(answer) {
      // For testing/debugging:
      // console.log(answer);
      var product = answer.productID;
      var quantity = answer.units;
      var sql = "SELECT stock_quantity, price FROM products WHERE item_id = ?";
      connection.query(sql, [product], function(err, res) {
        if (err) throw err;

        var newQuantity = res[0].stock_quantity - quantity;
        var orderTotal = res[0].price * quantity;

        if (newQuantity > 0) {
          var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
          connection.query(updateQuery, [newQuantity, product], function(err, res) {
            if (err) throw err;
            console.log("Thank you for your order. Your total is $" + orderTotal.toFixed(2) + ".");
            connection.end();
          })
        } else {
          console.log("Sorry, there is insufficient quantity to fill your order.");
          connection.end();
        }
      });
    });
}
