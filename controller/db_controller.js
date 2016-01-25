/**
 * Created by paul on 12.01.16.
 */
var mysql = require('mysql');

var connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'toor',
        database: 'comp_service_db'
    });

function getAllCustomers(callback) {
    connection.query("SELECT * FROM customers", function (err, rows) {
        if (err) {
            callback(null)
        } else {
            callback(rows);
        }
    });
}

function getCustomerById(id, callback) {
    connection.query("SELECT * FROM customers WHERE id = ?", id, function (err, rows) {
        if (err) {
            callback(null);
        } else {
            callback(rows);
        }
    });
}

function addCustomer(customer, callback) {
    customer.is_posted = 1;
    connection.query('INSERT INTO `customers` SET ?', customer, function(err, res) {
        callback(err, res);
    });
}

function updateCustomer(customer, callback) {
    var id = customer.id;
    var name = customer.name;
    var phone = customer.phone;
    var device = customer.device;
    var problem = customer.problem;
    var master = customer.master;
    var time_limit = customer.time_limit;
    var is_ready = customer.is_ready;
    var warranty = customer.warranty;
    var is_posted = customer.is_posted;
    var query = 'UPDATE `customers` set name = ?, phone = ?, device = ?, problem = ?, master = ?, time_limit = ?, ' +
        'is_ready = ?, warranty = ?, is_posted = ? WHERE id = ?';
    connection.query(
        query,
        [name, phone, device, problem, master, time_limit, is_ready, warranty, is_posted, id],
        function(err, result) {
            callback(err, result);
        }
    );
}

function deleteCustomer(id, callback) {
    connection.query(
        'DELETE FROM `customers` WHERE id = ?', id, function(err, result) {
            callback(err, result);
    });
}

exports.getAllCustomers = getAllCustomers;
exports.getCustomerById = getCustomerById;
exports.addCustomer = addCustomer;
exports.deleteCustomer = deleteCustomer;
exports.updateCustomer = updateCustomer;
