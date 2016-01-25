var Datastore = require('nedb'),
db = new Datastore({filename: 'customers.db', autoload: true});

var getAll, getById, del, add, update, getNoPosted, reload;

add = function(el, callback) {
	el.is_posted = el.is_posted === 1 ? 1 : 0;
	db.insert(el, function(err, data) {
		callback(data);
	});
};

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
			add(arr[i], function(a) {});
		}
	});
};

getNoPosted = function(callback) {
	db.find({is_posted: 0}, function(err, docs) {
		callback(err, docs);
	});
};

exports.getAll = getAll;
exports.getById = getById;
exports.del = del;
exports.add = add;
exports.update = update;
exports.reload = reload;
exports.getNoPosted = getNoPosted;
