// INSTRUCTIONS --------------
// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
//
// 6. The app should then prompt users with two messages.
//
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.
//
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
});

function displayProducts() {


}


// function which prompts the user for item details
function promptUser() {
  inquirer
    .prompt({
      name: "productID",
      type: "input",
      message: "What is the ID of the product you would like to buy?"
    })
    .then(function(answer) {
      // actions here
    });
}
