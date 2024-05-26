
const express = require('express');
const router = express.Router();
const {
    createMasterAccount,
    getMasterAccount,
    login,
    createDsaAccount,
    createAgentsAccount,
    getDsaAccount,
    getAgentsAccount 

} = require('../../Controllers/AccountsController');


router.post('/partners/create', createMasterAccount);
router.get('/partners/list', getMasterAccount);


router.post('/dsa/create/:partnerId', createDsaAccount);
router.get('/dsa/list/:partnerId', getDsaAccount);


router.post('/agents/create/:dsaId', createAgentsAccount);
router.get('/agents/list/:dsaId', getAgentsAccount);

router.post('/login', login);




module.exports = router;