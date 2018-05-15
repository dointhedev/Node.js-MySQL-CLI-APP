# Node.js & MySQL
> ### Example of MySQL + Nodejs codebase containing real world examples (CRUD through User Input) that simluates an online store. 

This repo is functionality in-complete — PRs and issues welcome it's 90% done!!

## Project Overview

In this example, I created an Amazon-like storefront with the MySQL and Nodejs. This app takes in orders from customers and depletes stock from the store's inventory. As well as having manager and supervisor user roles.

# Getting started

To get the Node server running locally:

- Clone this repo ([GIT](https://github.com/dointhedev/Node.js-MySQL-CLI-APP.git))
- Install Nodejs on your Mac ([Download](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew))
- `npm install` to install all required dependencies
- load the .sql file locally and make sure the credentials match up. 
- 'mysql.server start' Start the local database server
- `node bamazonCustomer.js` to start the customer side of this demonstatration
- `node bamazonManager.js` to start the manager side of this demonstatration
- `node bamazonSupervisor.js` to start the supervisor side of this demonstatration

# Code Overview

## Dependencies

- [mysql](https://www.npmjs.com/package/mysql) - This connect MySQL DB to Nodejs
- [inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command line user interfaces.
- [cli-table](https://www.npmjs.com/package/cli-table) - This utility allows you to render unicode-aided tables on the command line from your node.js scripts.

## Application Structure

- `bamazonCustomer.js` - The entry point to our application for the customer user type.
- `bamazonManager.js` - The entry point to our application for the manager user type.
- `bamazonSupervisor.js` - The entry point to our application for the supervisor user type.
- `_database/` - This folder contains the databases saved in each version.



