const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: { type: String ,
    required: true,
    minlength: 4,
    maxlength: 50
    },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String , required: true},
    age: { type: Number },
    gender: { type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value.toLowerCase())){
                throw new   Error("Gender must be   Male, Female or Other");
            }
        }
     },
    skills : { type: [String], default: [] }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;