import mongoose from "mongoose";

/** USER
 * User interface, representing the Position document in MongoDB
 */
export interface User{
	_id?:		mongoose.Types.ObjectId
	jwt?:	string
	name:	string
	firstname?:	string
	lastname?:	string
	email?:  string
	password:	string
	salt?:	string
	role:	string
	searchColor?: string
	language?: string

}

/** USERCLASS
 * the primary use of this class is to make generating objects satisfying the Item Interface
 * easier by offering an constructor
 */
export class UserClass implements User{
	_id?: mongoose.Types.ObjectId;
	jwt?: string;
	name:	string;
	firstname?:	string;
	lastname?:	string;
	email?:  string;
	password:	string;
	salt?:	string;
	role:	string;
	searchColor?: string;
	language?: string;

	constructor(
		name: string,
		password: string,
		role: string,
		salt?:	string,
		firstname?:	string,
		lastname?:	string,
		email?:  string,
		searchColor?: string,
		language?: string,
		jwt?: string,
		_id?: mongoose.Types.ObjectId
	){
		this.name = name,
		this.firstname = firstname,
		this.lastname = lastname,
		this.email = email,
		this.salt = salt,
		this.password = password,
		this.role = role,
		this.searchColor = searchColor ,
		this.language= language,
		this.jwt = jwt,
		this._id = _id
	}
}
