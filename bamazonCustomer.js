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
    //console.log('connected as id ' + connection.threadId);
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
            console.log("\nI'm sorry, there isn't enough for you to buy " + amount + " of " + res[0].product_name);
            response.howManyToBuy = 0;
            purchase();
        }else{
            placeOrder(amount, itemId, res[0].product_name, res[0].price, res[0].department_name);
        }
    });

    })
    .catch((err) => {
        console.error(err.message);
    });
}

function placeOrder(amount, itemId, name, price, dept){
    //update the stock quantity of the specified product in the db
    //display the total cost
    let total = Number(price * amount);
    connection.query("UPDATE sales SET revenue = (revenue + ?) WHERE department_name = ?", [total, dept], function(err, res){
        if(err) throw err;        
    });
    connection.query("UPDATE products SET stock_quantity = (stock_quantity -?) WHERE item_id = ?", [amount, itemId], function(err, res){
        if(err) throw err;
        console.log("\nYou are buying " + amount + " of " + name + " for $" + total + ".\n");
        remainingProduct(itemId);
    });
    
}

function remainingProduct(itemId){
   connection.query("SELECT * FROM products WHERE item_id=?", [itemId], function(err, res){
        if(err) throw err;
        console.log("Product remaining:\nID: " + res[0].item_id + "\nProduct: " + res[0].product_name + "\nDepartment: " + res[0].department_name + "\nPrice: " + res[0].price + "\nQuantity: " + res[0].stock_quantity + "\n");

        end();
    });
}

function displaySalesFigures(){
    connection.query("SELECT * FROM sales", function(err, res){
        if(err) throw err;

        let revArr = [];
        let deptArr = [];
        console.log("\n");
        for (let i = 0; i < res.length; i++) {
            console.log("Department: " + res[i].department_name + ";  Revenue: $" + res[i].revenue);
            revArr.push(res[i].revenue);
            deptArr.push(res[i].department_name);
        }
       
        let temp =  Math.max(...revArr);
        let position = revArr.indexOf(temp);
        
        console.log("\n***Highest Grossing Department: " + deptArr[position] + "***");
        connection.end();
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
        displaySalesFigures();
      }
    })
    .catch((err) => {
        console.error(err.message);
    });
}