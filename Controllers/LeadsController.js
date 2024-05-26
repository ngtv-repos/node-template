const Accounts = require('../Models/AccountsModel');
const Leads = require('../Models/LeadsLogs');


/**
 * Function to create a new lead in the database
 * 
 * @param {Object} req - The request object containing the lead data
 * @param {Object} res - The response object
 * @returns {Object} - A JSON object containing the newly created lead and a success message
 */
async function createLeads(req, res) {
    /**
     * Print the request body to the console for debugging purposes
     */
    console.log(req.body);

    /**
     * Get the required fields from the request body
     */
    const { phone, ccBank } = req.body;

    /**
     * Get the agent ID from the request params
     */
    const agentId = await req.params.agentId;

    /**
     * Retrieve the agent details from the database
     */
    const agentDetails = await Accounts.findOne({ _id: agentId });

    /**
     * Get the DSA ID from the agent details
     */
    const dsaId = agentDetails.parentId;

    /**
     * Retrieve the DSA details from the database
     */
    const dsaDetails = await Accounts.findOne({ _id: dsaId });

    /**
     * Get the partner ID from the DSA details
     */
    const partnerId = dsaDetails.parentId;

    /**
     * Check if all the required fields are present
     */
    if (!phone || !ccBank) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    /**
     * Create a new lead object with the given values
     */
    const lead = {
        agentId: agentId,
        dsaId: dsaId,
        partnerId: partnerId,
        customerDetails: {
            custMobile: phone,
            ccBank: ccBank
        },
        leadLogs: {
            date: Date.now(),
            status: "lead created",
            remarks: "-"
        }
    };

    /**
     * Save the new lead to the database
     */
    try {
        const newLead = await Leads.insertMany([lead]);
        return res.status(201).json({
            message: "Lead created successfully",
            data: newLead,
            status: "success",
            error: null,
            code: 201
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating lead",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}


// get all leads for the agent
async function getLeads(req, res) {
    const agentId = req.params.agentId;
    const leads = await Leads.find({ agentId: agentId });
    return res.status(200).json({
        message: "Leads fetched successfully",
        data: leads,
        status: "success",
        error: null,
        code: 200
    });
}


// close leads
async function closeLeads(req, res) {

    const leadId = req.params.leadId;
    const lead = await Leads.findOne({ _id: leadId });

    if (!lead) {
        return res.status(404).json({
            message: "Lead not found",
            data: null,
            status: "error",
            error: null,
            code: 404
        });
    }

    lead.leadLogs.status = "lead closed";
    lead.leadLogs.remarks = "Lead closed by agent";
    await lead.save();
    return res.status(200).json({
        message: "Lead closed successfully",
        data: lead,
        status: "success",
        error: null,
        code: 200
    });

}



module.exports = {
    createLeads,
    getLeads,
    closeLeads
}