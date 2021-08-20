import { Schema, model, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
export interface UserAttr {
	email: string;
	password: string;
}

// User Model Interface
interface UserModel extends Model<UserDocument> {
	add(attr: UserAttr): UserDocument;
}

// User document Interface
interface UserDocument extends Document, UserAttr {}

const userSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(_, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashedPassword = await bcrypt.hash(
			this.get('password'),
			+process.env.SALT_ROUNDS!
		);
		this.set('password', hashedPassword);
	}

	done();
});

userSchema.statics.add = (attrs: UserAttr) => {
	return new User(attrs);
};

const User = model<UserDocument, UserModel>('Users', userSchema);
export default User;
