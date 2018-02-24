// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//
//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
//
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
// END INSTRUCTIONS -------------

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
      var quantity = answer.units
      var sql = "SELECT stock_quantity FROM products WHERE item_id = ?";
      connection.query(sql, [product], function(err, res) {
        if (err) throw err;

        console.log(res[0].stock_quantity);
        var newQuantity = res[0].stock_quantity - quantity;

        if (newQuantity > 0) {
          var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
          connection.query(updateQuery, [newQuantity, product], function(err, res) {
            if (err) throw err;
            console.log(res);
            console.log("Thank you for your order. Your total is " + )
          })
        } else {
          console.log("Sorry, there is insufficient quantity to fill your order.");
        }
      });
      // connection.end();
    });

}
