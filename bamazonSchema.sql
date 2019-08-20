DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(75) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT (10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Tide", "Household Cleaning", 10.00, 20);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Bounce", "Household Cleaning", 5.00, 10);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("The Matrix", "Movies", 12.95, 2);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Pulp Fiction", "Movies", 15.00, 8);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Inglorius Bastards", "Movies", 10.00, 6);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Mario Maker", "Games", 19.99, 15);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Fortnite", "Games", 22.00, 22);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Red Dead Redemption II", "Games", 35.00, 18);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Graphic T-shirt", "Clothing", 15.00, 35);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Socks", "Household Cleaning", 5.00, 200);