const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    agentId: {
        type: String,
        required: true
    },
    dsaId: {
        type: String,
        required: true
    },
    partnerId: {
        type: String,
        required: true
    },
    customerDetails:{
        custMobile: {
            type: String,
            required: true
        },
        ccBank:{
            type: String,
            required: true
        }

    },
    leadLogs: {
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            required: true
        },
        remarks: {
            type: String,
            required: true
        },
    }

},{
    timestamps: true,
    versionKey: false,
    collection: 'leads',
    strict: false
});


module.exports = mongoose.model('Leads', leadsSchema);
