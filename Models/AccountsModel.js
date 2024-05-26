const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    parentId: {
        type: String,
        default: "Admin",
        required: true
    }
    

},{
    timestamps: true,
    versionKey: false,
    collection: 'accounts',
    strict: false
});


module.exports = mongoose.model('Accounts', accountsSchema);
