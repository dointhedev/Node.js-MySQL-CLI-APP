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

/*:::::::::::: GLOBAL VARIABLES :::::::::*/
var table = [];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    manInit();
});
// main function of the manager section of this app. 
function manInit() {
    inquirer.prompt({
        type: "list",
        message: "Welcome Manager, What do you want to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete A Product"],
        name: "selection"
    }).then(function (a) {
        // condition logic to switch between user choices
        switch (a.selection) {
            case "View Products for Sale":
                vwProd();
                break;
            case "View Low Inventory":
                vwLInv();
                break;
            case "Add to Inventory":
                adInv();
                break;
            case "Add New Product":
                adNProd();
                break;
            case "Delete A Product":
                delProd();
                break;
            default:
                console.log('make a selection');
                manInit()
                break;
        }
    })
// generate table headers 
    function genTbl() {
        table = [];
        table = new Table({
            head: ['ID', 'Department', 'Product', 'Price', 'Qty'],
            colWidths: [10, 20, 20, 10, 5]
        });
    }

// view products
    function vwProd() {
        genTbl();
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
                inquirer.prompt({
                    type: "confirm",
                    message: "Would you like to do anything else?",
                    name: "confirm",
                    default: true
                }).then(function (b) {
                    console.log(b.confirm);
                    if (b.confirm) {
                        manInit();
                    } else {
                        console.log('Thank you have a great day!')
                    }
                })
                connection.end();
            })
    }
// view low inventory 
    function vwLInv() {
        genTbl();
        console.log("Selecting low qty products...\n");
        connection.query(" SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5",
            function (err, res) {
                if (err) throw err;
                for (let i = 0; i < res.length; i++) {
                    const l = res[i];
                    table.push(
                        [l.id, l.department_name, l.product_name, l.price, l.stock_quantity]
                    );

                }
                console.log(table.toString());
                inquirer.prompt({
                    type: "confirm",
                    message: "Would you like to do anything else?",
                    name: "confirm",
                    default: true
                }).then(function (b) {
                    console.log(b.confirm);
                    if (b.confirm) {
                        manInit();
                    } else {
                        console.log('Thank you have a great day!');
                        connection.end();
                    }
                })

            })
    }
// add inventory 
    function adInv() {
        genTbl();
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
// get the id from the user 
                function id() {
                    inquirer.prompt({
                        name: "id",
                        message: "What is the ID of the product you would like to update?"
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
// get the qty from the user 
                function qty(id) {
                    inquirer.prompt({
                        name: "qty",
                        message: "How much qty you would like to add to product with id: " + id + " ?"
                    }).then(function (q) {
                        const nQ = parseInt(q.qty);
                        if ((nQ !== null) && (Number.isInteger(nQ))) {
                            prcS(parseInt(id), parseInt(q.qty));
                        } else {
                            console.log('Silly... Enter a qty! ... req: integer');
                            qty(nQ);
                        }
                    });
                }
            });
    }
// process the update function. 
    function prcS(id, qty) {
        console.log(id, qty);
        console.log("Updating product...\n");
        var query = connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: qty
                },
                {
                    id: id
                }
            ],
            function (err, res) {
            
              //  console.log(query.sql); Able to test the query
                genTbl();
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
                        inquirer.prompt({
                            type: "confirm",
                            message: "Would you like to do anything else?",
                            name: "confirm",
                            default: true
                        }).then(function (b) {
                            if (b.confirm) {
                                manInit();
                            } else {
                                console.log('Thank you have a great day!');
                                connection.end();
                            }
                        })
                        connection.end();
                    });

            }
        );

    }

}
// add new product function 
function adNProd() {
    console.log("Welcome to the Add Inventory Section...\n");
    inquirer.prompt([{
            name: "d",
            message: "What Department?"
        }, {
            name: "p",
            message: "Product Name?"
        }, {
            name: "pr",
            message: "Product Price?"
        }, {
            name: "q",
            message: "Product QTY?"
        },

    ]).then(function (iNv) {
        console.log('Your New Product');
        genTbl();
        table.push(
            ['?', iNv.d, iNv.p, iNv.pr, iNv.q]
        );
        console.log(table.toString());
        inquirer.prompt({
            type: "confirm",
            message: "Are you sure you want to add product?",
            name: "confirm",
            default: true
        }).then(function (b) {
            if (b.confirm) {
                console.log("Inserting a new product...\n");
                var query = connection.query(
                    "INSERT INTO products SET ?", {
                        department_name: iNv.d,
                        product_name: iNv.p,
                        price: parseFloat(iNv.pr),
                        stock_quantity: parseFloat(iNv.q)
                    },
                    function (err, res) {
                        //   console.log(res.affectedRows + " product inserted!\n");
                        //  console.log(query.sql);
                        //  console.log(res);
                        genTbl();
                        console.log("Showing All ...\n");
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
                                inquirer.prompt({
                                    type: "confirm",
                                    message: "Would you like to do anything else?",
                                    name: "confirm",
                                    default: true
                                }).then(function (b) {
                                    if (b.confirm) {
                                        manInit();
                                    } else {
                                        console.log('Thank you have a great day!');
                                        connection.end();
                                    }
                                })
                            });
                    }
                );
            } else {
                console.log('Thank you have a great day!');
                connection.end();
            }
        })
    });

}
// delete product function 
function delProd() {
    genTbl();
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
                    message: "What is the ID of the product you would like to delete?"
                }).then(function (a) {
                    const n = parseInt(a.id);
                    const arrN = parseInt(res.length);
                    console.log(n);
                    console.log(arrN);
                    if ((n !== null) && (Number.isInteger(n)) && (arrN >= n)) {
                        del(a.id);
                    } else {
                        console.log('Silly... Enter a number ID! ... req: integer | product id needs to exist ');
                        id();
                    }

                });

            }
        })

    function del(id) {
        console.log("Deleting product id: " + id + "...\n");
        var query = connection.query("DELETE FROM products WHERE ?", [{
                id: id
            }],
            function (err, res) {
                console.log(res);
                connection.end();
            })
    }
}