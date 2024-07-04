const axios = require('axios');
const jsdom = require('jsdom');
const express = require('express');
const cors = require('cors');
const { JSDOM } = jsdom;

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/contests');

        const html = response.data;
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const table = document.querySelector('table');

        if(!table){
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        const rows = table.querySelectorAll('tr');

        const tableData = [];
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td', 'th');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            tableData.push(rowData);
        });

        let registrationOpened = "No";
        const registrationStatus = tableData[1][5].toString();
        if (registrationStatus.includes("Register")) {
            registrationOpened = "Yes";
        }

        res.status(200).json({
            success: true,
            contestName: tableData[1][0],
            start: tableData[1][2],
            contestLength: tableData[1][3],
            registrationOpened: registrationOpened,
            data: tableData
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server Connected at port ${PORT}`);
});
