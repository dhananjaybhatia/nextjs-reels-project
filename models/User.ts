import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exist"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [5, "Password must be at least 5 characters"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash("this.password", 10);
    }
    next();
});

// Add the static method
userSchema.statics.findByEmailWithPassword = function (email: string) {
    return this.findOne({ email }).select('+password').exec();
};

// ✅ Reuse existing model if already defined (helps avoid OverwriteModelError during hot-reloading in Next.js)

const UserModel = mongoose.models?.UserModel || mongoose.model<IUser>("UserModel", userSchema)
export default UserModel