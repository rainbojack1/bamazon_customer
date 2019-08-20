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
            console.log("Product: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n");
        }
    });
}