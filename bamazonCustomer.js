/*:::::::::::: REQUIRE :::::::::*/
var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require('inquirer');

/*:::::::::::: MYSQL CONNECT :::::::::*/
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

/*:::::::::::: GLOBAL VARIABLE :::::::::*/
var order = [];
var table = [];


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    dizAllProd();
});


function dizAllProd() {
    table = new Table({
        head: ['ID', 'Department', 'Product', 'Price', 'Qty'],
        colWidths: [10, 20, 20, 10, 5]
    });
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;

            for (let i = 0; i < res.length; i++) {
                const r = res[i];
                table.push(
                    [r.id, r.department_name, r.product_name, r.price, r.stock_quantity]
                );

            }
            console.log(table.toString());

            id();

            function id() {
                inquirer.prompt({
                    name: "id",
                    message: "What is the ID of the product you would like to buy?"
                }).then(function (a) {
                    const n = parseInt(a.id);
                    const arrN = parseInt(res.length);
                    if ((n !== null) && (Number.isInteger(n)) && (arrN >= n)) {
                        qty(a.id);
                    } else {
                        console.log('Silly... Enter a number ID! ... req: integer | product id needs to exist ');
                        id();
                    }
                });
            }

            function qty(id) {
                inquirer.prompt({
                    name: "qty",
                    message: "How many products with id: " + id + " would like to buy?"
                }).then(function (q) {
                    const nQ = parseInt(q.qty);
                    if ((nQ !== null) && (Number.isInteger(nQ)) && (nQ <= 10)) {
                        prcS(id, q.qty);
                    } else {
                        console.log('Silly... Enter a qty! ... req: integer | qty limit is 10');
                        qty(nQ);
                    }
                });
            }

            function prcS(id, qty) {
                order = new Table({
                    head: ['ID', 'Department', 'Product', 'Item Price', 'Qty', 'Total'],
                    colWidths: [10, 20, 20, 20, 5, 10]
                });                
                connection.query(
                    "SELECT * FROM products WHERE ?", {
                        id: id
                    },
                    function (err, res) {
                        if (err) throw err;
                        const oDr = res[0];
                        var adminSt = oDr.stock_quantity;
                        var cuSt = qty;
                        var total = oDr.price * qty;
                        var nwQty = adminSt - qty;
                        if (nwQty >= 0) {
                            order.push(
                                [oDr.id, oDr.department_name, oDr.product_name, oDr.price, cuSt, total]
                            );
                            console.log(':::::::::::::: Your Order:::::::::::::::');
                            console.log(order.toString());
                            inquirer.prompt({
                                type: "confirm",
                                message: "Confirm Your Order:",
                                name: "confirm",
                                default: true
                            }).then(function (b) {
                                console.log(b.confirm);
                                if (b.confirm) {
                                    connection.query(
                                        "UPDATE products SET ? WHERE ?", [{
                                                stock_quantity: nwQty
                                            },
                                            {
                                                id: id
                                            }
                                        ],
                                        function (err, res) {
                                            if (err) throw err;

                                        });
                                    console.log('Your Order has been processed');
                                    connection.end();
                                } else {
                                    console.log('Transaction Canceled')
                                    connection.end();
                                }
                            });
                        } else {
                            console.log('The qty on this item is not enough to purchase');
                            inquirer.prompt({
                                type: "confirm",
                                message: "Would you like to place another Order:",
                                name: "confirm",
                                default: true
                            }).then(function (b) {
                                table = [];
                                dizAllProd();
                            })
                        }
                    });
            }
        });
}