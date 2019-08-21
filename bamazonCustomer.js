var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user: 'root',
password: 'Atlanta83',
database: 'bamazonDB'
});

connection.connect(function (err) {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId);
    findAll();
});

function findAll(){
    connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;
        //console.log(res);

        for (let i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n");
        }

        purchase();
    });
}

function purchase(){
    inquirer
    .prompt([
      {
          name: "whatToBuy",
          type: "number",
          message: "Please enter the ID of the product you would like to buy."  
      },
      {
          name: "howManyToBuy",
          type: "number",
          message: "How many would you like to buy?",
          validate: function(value) {
            if ((isNaN(value) === false) && (value > 0)) {
                return true;
            }else{
                return "Please enter a valid number for the amount you would like to buy.";
            }
          }
        }
    ])
    .then((response) => {
      let itemId = response.whatToBuy;
      let amount = response.howManyToBuy;

    connection.query("SELECT * FROM products WHERE item_id=?", [itemId], function(err, res){
        if(err) throw err;
        // console.log(res);

        if(amount > res[0].stock_quantity){
            console.log("I'm sorry, there isn't enough for you to buy " + amount + " of " + res[0].product_name);
            response.howManyToBuy = 0;
            purchase();
        }else{
            placeOrder(amount, itemId, res[0].product_name, res[0].price);
        }
    });

    })
    .catch((err) => {
        console.error(err.message);
    });
}

function placeOrder(amount, itemId, name, price){
    //update the stock quantity of the specified product in the db
    //display the total cost
    let total = Number(price * amount);
    connection.query("UPDATE products SET stock_quantity = (stock_quantity -?) WHERE item_id = ?", [amount, itemId], function(err, res){
        console.log("You are buying " + amount + " of " + name + " for $" + total + ".\n");
        remainingProduct(itemId);
    });
}

function remainingProduct(itemId){
    let query = connection.query("SELECT * FROM products WHERE item_id=?", [itemId], function(err, res){
        if(err) throw err;
        console.log("Product remaining:\nID: " + res[0].item_id + "\nProduct: " + res[0].product_name + "\nDepartment: " + res[0].department_name + "\nPrice: " + res[0].price + "\nQuantity: " + res[0].stock_quantity + "\n");

        end();
    });
}

function end(){
    inquirer
    .prompt([
      {
          name: "startOver",
          type: "list",
          message: "Would you like to purchase something else?",
          choices: ["yes", "no"]
      }
    ])
    .then((response) => {
      if(response.startOver === "yes"){
          findAll();
      }else{
        connection.end();
      }
    })
    .catch((err) => {
        console.error(err.message);
    });
}