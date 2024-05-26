
const express = require('express');
const router = express.Router();
const {
    createLeads,
    getLeads,
    closeLeads

} = require('../../Controllers/LeadsController');


router.post('/create/:agentId', createLeads);
router.get('/getLeads/:agentId', getLeads);

router.post('/closeLead/:leadId', closeLeads);






module.exports = router;