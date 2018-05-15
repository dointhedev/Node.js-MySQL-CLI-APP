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
var checkOut = [];



connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    manInit();
});
// main function of the manager section of this app. 
function manInit() {
    inquirer.prompt({
        type: "list",
        message: "Welcome Supervisor, What do you want to do?",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "selection"
    }).then(function (a) {
        // condition logic to switch between user choices
        switch (a.selection) {
            case "View Product Sales by Department":
                vwPrByDep();
                break;
            case "Create New Department":
                crtNwDep();
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
        console.log("Showing All ...\n");
        connection.query("SELECT * FROM departments",
            function (err, res) {
                if (err) throw err;
                table = new Table({
                    head: ['ID', 'Department', 'Over Head'],
                    colWidths: [10, 20, 20]
                });
                for (let i = 0; i < res.length; i++) {
                    const r = res[i];
                    table.push(
                        [r.id, r.department_name, r.over_head_costs]
                    );
                }
                console.log(table.toString());
            }); 
    }
    function vwPrByDep() {
        console.log("vwPrByDep");
        console.log("Selecting all departments...\n");
        connection.query("SELECT departments.id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments JOIN products on departments.department_name = products.department_name; ",
        function(err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          checkOut = [];
          checkOut = new Table({
              head: ['ID', 'Department', 'Over Head', 'Product Sales'],
              colWidths: [10, 20, 20, 20]
          });
          for (let i = 0; i < res.length; i++) {
            const r = res[i];
            checkOut.push(
                [r.id, r.department_name, r.over_head_costs, r.product_sales]
            )
          } console.log(checkOut.toString());
          //console.log(res);
          connection.end();
        });
    }

    function crtNwDep() {
        genTbl();

        console.log("crtNwDep");
        // add new product function 
        console.log("Welcome to the Add Department Section...\n");
        inquirer.prompt([{
                name: "dep",
                message: "Department Title?"
            }, {

                name: "cost",
                message: "Over Head Costs?"
            },

        ]).then(function (a) {
            checkOut = [];
            checkOut = new Table({
                head: ['ID', 'Department', 'Over Head'],
                colWidths: [10, 20, 10]
            });
            console.log('Your New Department');
            checkOut.push(
                ['?', a.dep, a.cost]
            )
            console.log(checkOut.toString());
            inquirer.prompt({
                type: "confirm",
                message: "Are you sure you want to add this department?",
                name: "confirm",
                default: true
            }).then(function (b) {
                    if (b.confirm) {
                        console.log("Creating new department...\n");
                        var query = connection.query(
                            "INSERT INTO departments SET ?", {
                                department_name: a.dep,
                                over_head_costs: parseFloat(a.cost)
                            },
                            function (err, res) {
                                //   console.log(res.affectedRows + " product inserted!\n");
                                //  console.log(query.sql);
                                //  console.log(res);
                                genTbl();
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
                    }else {
                console.log('Thank you have a great day!');
                connection.end();
            }
        })
    });

}
}


/*
4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

   * Hint: You may need to look into aliases in MySQL.

   * Hint: You may need to look into GROUP BYs.

   * Hint: You may need to look into JOINS.

   * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

- - -*/