
import express from 'express';
import {MongoClient} from 'mongodb';
import insertHandler from "./routes/POST.js";
import summaryUpdateHandler from "./routes/change/summary/PUT";
import deleteHandler from "./routes/DELETE";
import allFiles from "./routes/all/GET";
import filesFromAuthor from "./routes/author/GET";
import filesFromSubject from "./routes/subject/GET";
import filesFromLecture from "./routes/lecture/GET";
import oneFile from "./routes/GET";

const app = express();
app.use(express.json());
const router = express.Router();


const PORT = process.env.PORT || 11600;
const uri = 'mongodb://localhost:27017';
const database = 'files';
const collection = "files";
let client;
let db;


if (!PORT) {
    console.error("Critical Error: Missing PORT environment variable. Please set it.");
    process.exit(1);
}

await startConnection();


// insert a file into the database
router.post('/', async (req, res) => {
    insertHandler(req, res, client, collection, db);
})

// update ai summary
router.put('/change/summary', async (req, res) => {
    summaryUpdateHandler(req, res, client, collection, db);
})

// delete file
router.put('/:fileid', async (req, res) => {
    deleteHandler(req, res, client, collection, db);
})


// get all files
router.get('/all', async (req, res) => {
    allFiles(req, res, client, collection, db);
})
// get all files from an author
router.get('/author/:id', async (req, res) => {
    filesFromAuthor(req, res, client, collection, db);
})
// get all files from a subject
router.get('/subject/:id', async (req, res) => {
    filesFromSubject(req, res, client, collection, db);
})
// get all files from a lecture
router.get('/lecture/:id', async (req, res) => {
    filesFromLecture(req, res, client, collection, db);
})
// get one file
router.get('/:id', async (req, res) => {
    oneFile(req, res, client, collection, db);
})

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Database listening on ${PORT}`);
})

//close database connection on script ending
process.on('exit', async () => {
    client.close().then(r => process.exit(0));
})
process.on('SIGINT', async () => {
    client.close().then(r => process.exit(0));
})
process.on('SIGTERM', async () => {
    client.close().then(r => process.exit(0));
})


async function startConnection() {
    client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to MongoDB');
        db = await client.db(database);
        console.log('Connected to files-database');
    }
    catch (err) {
        console.error(err);
    }
}