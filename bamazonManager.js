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
        case "Add to Inventory": addInventory();
          break;
        case "Add New Product": addNewProduct();
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
    connection.end();
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
    connection.end();
  });
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "What is the ID of the product for which you would like to add more inventory?"
      },
      {
        name: "units",
        type: "input",
        message: "How many of this item would you like to add?"
      }
    ])
    .then(function(answer) {
      var product = answer.productID;
      var quantity = parseInt(answer.units);
      var sql = "SELECT stock_quantity FROM products WHERE item_id = ?";
      connection.query(sql, [product], function(err, res) {

        var newQuantity = res[0].stock_quantity + quantity;
        var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

        connection.query(updateQuery, [newQuantity, product], function(err, res) {
          if (err) throw err;
          console.log("Thank you. The updated quanity for this item is " + newQuantity + ".");
          connection.end();
        });
      });
    });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the product that you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "Which department does this product belong in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of this item?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of this item would you like to add to your inventory?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: parseFloat(answer.price),
          stock_quantity: parseInt(answer.quantity)
        },
        function(err) {
          if (err) throw err;
          console.log("Your product was successfully added to inventory.");
          connection.end();
        }
      );

    });

}
