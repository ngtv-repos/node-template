const Accounts = require('../Models/AccountsModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { get } = require('mongoose');
const ExcelJS = require('exceljs');
const crypto = require('crypto');


const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new master account with the given name, email, password, and role.
 * The isDeleted field is set to false by default.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>}
 */
async function createMasterAccount(req, res) {

    // print request body
    console.log(req.body);

    // Get the required fields from the request body
    const { name, email, password, parentId } = req.body;
    const role = "Partner";
    const isDeleted = false;

    console.log(name, email, password, role, isDeleted);

    // Check if all the required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash the password before storing it
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        // Create a new account object with the given values
        const account = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            isDeleted,
            parentId: parentId
        };

        console.log(account);

        // Attempt to create the account in the database
        let result = await Accounts.create(account);
        
        

        console.log(result);

        return res.status(200).json({
            message: "Account created successfully",
            data: result,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error creating account",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}

async function createDsaAccount(req, res) {

    // print request body
    console.log(req.body);

    // Get the required fields from the request body
    const { name, email, password } = req.body;
    const role = "dsa";
    const isDeleted = false;

    console.log(name, email, password, role, isDeleted);

    // Check if all the required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash the password before storing it
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        // Create a new account object with the given values
        const account = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            isDeleted,
            parentId: req.params.partnerId
        };

        console.log(account);

        // Attempt to create the account in the database
        let result = await Accounts.create(account);
        
        

        console.log(result);

        return res.status(200).json({
            message: "Account created successfully",
            data: result,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error creating account",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}


async function createAgentsAccount(req, res) {
    console.log(req.body);

    let { count } = req.body;
    const role = "agents";
    const isDeleted = false;

    // convert count to number
    count = parseInt(count);

    console.log(count, role, isDeleted);

    if (!count || typeof count !== 'number' || count <= 0) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const generateRandomEmail = () => {
        const uniqueString = uuidv4().replace(/-/g, '').slice(0, 11);
        return `agent_${uniqueString}@agents.local`;
    };

    const generateRandomPassword = (length = 12) => {
        return crypto.randomBytes(length).toString('base64').slice(0, length);
    };

    const generateRandomName = (index) => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomChars = '';
        for (let i = 0; i < 3; i++) {
            randomChars += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return `${randomChars}_${date}_${String(index).padStart(3, '0')}`;
    };
    
    try {
        const accounts = [];
        const plainPasswords = [];

        console.log(count);

        for (let i = 0; i < parseInt(count); i++) {
            const name = generateRandomName(i + 1);
            const email = generateRandomEmail();
            const plainPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const account = {
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
                isDeleted,
                parentId: req.params.dsaId
            };

            accounts.push(account);
            plainPasswords.push({ email, plainPassword });
        }

        console.log(accounts);

        let results = await Accounts.insertMany(accounts);

        console.log(results);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Agents');

        worksheet.columns = [
            // { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Password', key: 'password', width: 20 },
        ];

        plainPasswords.forEach((account) => {
            worksheet.addRow({ email: account.email, password: account.plainPassword });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="agents.xlsx"');

        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Error creating accounts",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}

/**
 * Retrieves a master account from the database.
 * The account is filtered by its role and isDeleted fields.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>}
 */
async function getMasterAccount(req, res) {
    try {
        const account = await Accounts.find({ role: "Partner", isDeleted: false });

        if (!account) {
            return res.status(404).json({
                message: "No account found",
                data: null,
                status: "error",
                error: "No account found",
                code: 404
            });
        }

        return res.status(200).json({
            message: "Account retrieved successfully",
            data: account,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving account",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}


async function getDsaAccount(req, res) {
    try {
        const account = await Accounts.find({ role: "dsa",parentId: req.params.partnerId,isDeleted: false });

        if (!account) {
            return res.status(404).json({
                message: "No account found",
                data: null,
                status: "error",
                error: "No account found",
                code: 404
            });
        }

        return res.status(200).json({
            message: "Account retrieved successfully",
            data: account,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving account",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}


async function getAgentsAccount(req, res) {
    try {
        const account = await Accounts.find({ role: "agents", parentId: req.params.dsaId,isDeleted: false });

        if (!account) {
            return res.status(404).json({
                message: "No account found",
                data: null,
                status: "error",
                error: "No account found",
                code: 404
            });
        }

        return res.status(200).json({
            message: "Account retrieved successfully",
            data: account,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving account",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}


// login api
async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Missing required fields",
            data: null,
            status: "error",
            error: "Missing required fields",
            code: 400
        });
    }

    try {
        const account = await Accounts.findOne({ email: username });

        if (!account) {
            return res.status(404).json({
                message: "No account found",
                data: null,
                status: "error",
                error: "No account found",
                code: 404
            });
        }

        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                data: null,
                status: "error",
                error: "Invalid credentials",
                code: 401
            });
        }

        return res.status(200).json({
            message: "Login successful",
            data: account,
            status: "success",
            error: null,
            code: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error logging in",
            data: null,
            status: "error",
            error: error.message,
            code: 500
        });
    }
}

module.exports = {
    createMasterAccount,
    getMasterAccount,
    login,
    getDsaAccount,
    getAgentsAccount,
    createAgentsAccount,
    createDsaAccount
};
