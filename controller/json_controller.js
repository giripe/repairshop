/**
 * Created by paul on 18.01.16.
 */

var loki = require('lokijs'),
    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    reloadFile,
    getNoPosted;
var db = new loki('orders.json');

reloadFile = function(arr) {
    var customers = db.addCollection('customers');
    for (var i = 0; i < arr.length; i++) {
        customers.insert(arr[i]);
    }
    db.saveDatabase();
}

addCustomer = function(customer) {
    customer.is_posted = customer.is_posted === 1 ? 1 : 0;
    db.loadDatabase({}, function() {
        var customers = db.getCollection('customers');
        customers.insert(customer);
        db.saveDatabase();
    });
}

//сохранять айдишники удаленных элементов в файл для синхронизации при заходе в онлайн
deleteCustomer = function(id) {
    db.loadDatabase({}, function() {
        var customers = db.getCollection('customers');
        customers.removeWhere({'id': id});
        db.saveDatabase();
    });
}

updateCustomer = function(customer) {
    db.loadDatabase({}, function() {
        customer.is_posted = 0;
        var customers = db.getCollection('customers');
        var model = customers.find({id: customer.id});
        model = model[0];
        console.log('MODEL: ' + JSON.stringify(model));
        for (var attr in customer) {
            model.attr = customer.attr;
        }
        console.log("UPDATED: " + JSON.stringify(model));
        customers.update(model);
        db.saveDatabase();
    });
}

getAllCustomers = function(callback) {
    db.loadDatabase({}, function() {
        var customers = db.getCollection('customers');
        callback(customers.data);
    });
}

getCustomerById = function(id, callback) {
    db.loadDatabase({}, function() {
        var customers = db.getCollection('customers');
         callback(customers.find({id: id}));
    });
}

getNoPosted = function(callback) {
    db.loadDatabase({}, function() {
        var customers = db.getCollection('customers');
        callback(customers.find({is_posted: 0}));
    })
}

exports.getNoPosted = getNoPosted;
exports.addCustomer = addCustomer;
exports.deleteCustomer = deleteCustomer;
exports.updateCustomer = updateCustomer;
exports.getAllCustomers = getAllCustomers;
exports.getCustomerById = getCustomerById;
exports.reloadFile = reloadFile;