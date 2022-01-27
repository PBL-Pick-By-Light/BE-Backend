import mongoose from "mongoose";

/** USER
 * User interface, representing the Position document in MongoDB
 */
export interface User{
	_id?:		mongoose.Types.ObjectId
	jwt?:	string
	name:	string
	password:	string
	salt:	string
	role:	string
}

/** USERCLASS
 * the primary use of this class is to make generating objects satisfying the Item Interface
 * easier by offering an constructor
 */
export class UserClass implements User{
	_id?: mongoose.Types.ObjectId;
	jwt?: string;
	name:	string;
	password:	string;
	salt:	string;
	role:	string;

	constructor(
		name: string,
		salt:	string,
		password: string,
		role: string,
		jwt?: string,
		_id?: mongoose.Types.ObjectId
	){
		this.name = name,
		this.salt = salt,
		this.password = password,
		this.role = role
		this.jwt = jwt,
		this._id = _id
	}
}
