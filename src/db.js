/**
 * A singleton implemetaion for the database
 */

module.exports = (() => {
	let instance;
	const createInstance = () => {
		const mongoose = require("mongoose");
		const config = require("./config");

		mongoose.connect(config.DATA_MONGO_URL, { useCreateIndex: true, useNewUrlParser: true });
		const Schema = mongoose.Schema;

		console.log('Data Db initialized');
		// Data Schema
		const dataSchema = new Schema({
			_box: { type: String, index: true, select: false }, // box to which the record belongs
			_collection: { type: String, index: true, select: false }, // Any collection if user passes in URL
			_createdOn: Date, // Date on which its created
			_createdBy: { type: String, select: false }, // API KEY used to create the record
			_updatedOn: Date, // Date on which its updated
			_updatedBy: { type: String, select: false }, // API KEY used to updated the record
			data: { type: Object } // Actual data of the record
		});

		// Users Schema
		const userSchema = new Schema({
			name: String,
			email: { type: String, index: true, unique: true },
			password: String,
			joinedOn: Date,
			lastLoginOn: Date,
			token: { type: String, index: true, unique: true },
			verified: Boolean,
			code: String,
			resetCode: String
		});

		// Box Schema
		const boxSchema = new Schema({
			name: String,
			key: { type: String, index: true, unique: true },
			type: { type: String, enum: ['PRIVATE', 'PUBLIC'] },
			expiresOn: Date,
			createdOn: Date,
			createdBy: { type: Schema.Types.ObjectId, ref: "Users", index: true },
			users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
			access: [{
				key: { type: String, index: true },
				permission: { type: String, enum: ['READ', 'READWRITE'] }
			}],
			noOfRecords: { type: Number, default: 0 },
			deleted: Boolean
		});


		return {
			User: mongoose.model("User", userSchema),
			Box: mongoose.model("Box", boxSchema),
			Data: mongoose.model("Data", dataSchema)
		};
	}
	return {
		getInstance: () => {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();