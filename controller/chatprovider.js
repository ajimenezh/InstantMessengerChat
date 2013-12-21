var mongostr = 'mongodb://alex:qwertyASD@dharma.mongohq.com:10061/app19679708'
var localstr = "mongodb://localhost/project1";

var connect = require('connect');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;
var database = null;

ChatProvider = function() {

  mongo.connect(localstr, {}, function(error, db){
    console.log("connected, db: " + db);

    database = db;

    database.addListener("error", function(error){
      	console.log("Error connecting to MongoLab");
    });
  });
};

ChatProvider.prototype.getCollection= function(callback) {
	database.collection('chatCollection', function(error, chat_collection) {
		if (error) callback(error);
		else callback(null, chat_collection);
	})
}

ChatProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, chat_collection) {
		if (error) callback(error) 
		else {
			chat_collection.find().toArray(function(error, results) {
				if (error) callback(error)
				else callback(null, results)
			});
		}
	})
};

ChatProvider.prototype.findOne = function(req, callback) {
	this.getCollection(function(error, chat_collection) {
		if (error) callback(error) 
		else {
			chat_collection.findOne({chatHash: req}, function(error, results) {
				if (error) callback(error);
				else callback(null, results);
			});
		}
	});
};

ChatProvider.prototype.insert = function(req, callback) {
	this.getCollection(function(error, chat_collection) {
		if (error) callback(error)
		else {
			chat_collection.findOne({chatHash: req}, function(error, results) {
				if (error) callback(error);
				else {
					if (!results) {
						chat_collection.insert({
							chatHash: req,
							chatMessages: []
						}, function(error, result) {
							if(error) callback(error);
							else callback(null,result);
						});
					}
					else callback(null,results);
				}
			});
		}
	});
};


ChatProvider.prototype.update = function(req, callback) {
	this.getCollection(function(error, chat_collection) {
		if (error) callback(error)
		else {
			console.dir(req);
			chat_collection.update(
				{ chatHash: req.chatHash },
				{ $push: {chatMessages: req } }
				, function(error, result) {
				if(error) callback(error);
				else callback(null,result);
			});
		}
	});
};


exports.ChatProvider = ChatProvider;