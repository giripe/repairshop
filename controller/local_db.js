var Datastore = require('nedb'),
db = new Datastore({filename: 'customers.db', autoload: true});

var counter = 1000000;

var getAll, getById, del, add, update, sync, reload;

getAll = function(callback) {
	db.find({}, function(err, docs) {
		callback(docs);
	});
};

getById = function(id, callback) {
	db.findOne({_id: id}, function(err, doc) {
		callback(doc);
	});
};

del = function(time, callback) {
	db.remove({date: time}, function(err, numRows) {
		callback(numRows);
	});
};

add = function(el, callback) {
	el.id = ++counter;
	el.is_posted = el.is_posted === 1 ? 1 : 0;
	db.insert(el, function(err, data) {
		callback(data);
	});
};

update = function(el, callback) {
	el.is_posted = 0;
	el.date = Number(el.date);
	db.update({date: el.date}, el, {}, function(err, numRows) {
		callback(err,numRows);
	});
};

reload = function(arr) {
	db.remove({}, {multi: true}, function(err, numRows) {
		for (var i = 0; i < arr.length; i++) {
			add(arr[i], function(a) {

			});
		}
	});
};

exports.getAll = getAll;
exports.getById = getById;
exports.del = del;
exports.add = add;
exports.update = update;
exports.reload = reload;


//{"id":"1000001","date":"1453242077205","name":"Michael Jackson","phone":"=777777777",
// "device":"BlackBerry","problem":"Keyboard is bad","is_ready":"1","warranty":"","time_limit":""}

//{"name":"123","phone":"321","device":"","problem":"11111","is_ready":"0",
// "warranty":"","time_limit":"","date":1453242077205,"id":1000001,"is_posted":0,"_id":"Jwj7YbmJwJJPeWOv"}