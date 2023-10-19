const express = require('express');
const mysql = require('mysql2/promise'); // Use 'mysql2/promise' for better async/await support
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// MySQL Database Configuration
const dbConfig = {
  host: '192.168.57.82',
  user: 'roothost',
  password: '1234567890',
  database: 'ps-sb2_mirror',
};

// Create a pool of database connections
const pool = mysql.createPool(dbConfig);

// Define a simple route to test the database connection
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ result: rows[0].result });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/tfile', async (req, res) => {
    try {
        const [tfiles] = await pool.query('SELECT * FROM t_file')
        const tfilesData = tfiles[0];
        const [countRes] = await pool.query('SELECT COUNT(*) AS count FROM t_file');
        const tfilesCount = countRes[0].count;

        res.json({
            result: true,
            message: "Successfully fetched t_files",
            tfilesCount: tfilesCount,
            tfilesData: tfilesData
        })
    } catch (err) {
        console.error('Error :', err)
        res.status(500).json({
            error: 'An error occured'
        })
    }
})

app.post('/shinva', async (req, res) => {
    const { strComing } = req.body;
    const workOrder = "G22099999";
    const batch = "G70H52A";
    const isPrint = 0;
    const isType = 2;
    var secondary1, secondary2;
    var internal1, internal2;
    var header1, header2;
    var packing1, packing2;
    // console.log(strComing)
    
    try {
        // Create a timestamp
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] Start`);
        // Splitting incoming data
        const dataArray = strComing.split(';')
        const dataLength = dataArray.length
        if (dataLength == 7) {
            // Get secondary from DB
            [secondary1] = await pool.query('SELECT * FROM t_file WHERE WorkOrder = ? AND BatchNumber = ? AND Type = ? AND IsPrint = ? LIMIT 1', [workOrder, batch, isType, isPrint])
            internal1 = secondary1[0].InternalID
            header1 = secondary1[0].FileName
            packing1 = dataArray[3]
            dataArray[3] = secondary1[0].FileName
            // Update the isPrint value in the database to -1
            await pool.query('UPDATE t_file SET IsPrint = ? WHERE InternalID = ?', [-1, secondary1[0].InternalID]);
            [secondary2] = await pool.query('SELECT * FROM t_file WHERE WorkOrder = ? AND BatchNumber = ? AND Type = ? AND IsPrint = ? LIMIT 1', [workOrder, batch, isType, isPrint])
            internal2 = secondary1[0].InternalID
            header2 = secondary2[0].FileName
            packing2 = dataArray[5]
            dataArray[5] = secondary2[0].FileName
            // Update the isPrint value in the database to -1
            await pool.query('UPDATE t_file SET IsPrint = ? WHERE InternalID = ?', [-1, secondary1[0].InternalID]);
        }
        // Join the array elements with semicolon as the delimiter
        const rejoinedString = dataArray.join(';');
        // Kirim kode ke Shinva

        // Update isPrint secondary menjadi 2
        await pool.query('UPDATE t_file SET IsPrint = ? WHERE InternalID IN (?, ?)', [0, internal1, internal2]);
        // Kirim ke fungsi lain untuk insert ke t_packing_list_header dan t_packing_list_detail
        updatePackingList(header1, packing1)
        updatePackingList(header2, packing2)
        console.log(`[${timestamp}] Finish`);
        res.json({
            result: true,
            message: "Success",
            data: rejoinedString
        })
    } catch (err) {
        console.error('Error', err)
        res.status(500).json({
            error: 'An error occured'
        })
    }
})

async function updatePackingList(header, details) {
    var header = header
    var details = details
    // console.log(header)
    // console.log(details)
}

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
