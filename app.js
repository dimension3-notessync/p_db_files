
import express from 'express';
import {MongoClient} from 'mongodb';
import insertHandler from "./routes/POST.js";
import summaryUpdateHandler from "./routes/change/summary/PUT.js";
import deleteHandler from "./routes/DELETE.js";
import allFiles from "./routes/all/GET.js";
import filesFromAuthor from "./routes/author/GET.js";
import filesFromSubject from "./routes/subject/GET.js";
import filesFromLecture from "./routes/lecture/GET.js";
import oneFile from "./routes/GET.js";

const app = express();
app.use(express.json());
const router = express.Router();


const PORT = process.env.PORT || "undefined";
const uri = process.env.CONNECTION_STRING || "undefined";
const database = 'files';
const collection = "files";
let client;
let db;


if (uri === "undefined") {
    console.log("Missing uri");
    process.exit(1);
}
if (PORT === "undefined") {
    console.log("Missing PORT");
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
router.get('/author/:authorID', async (req, res) => {
    filesFromAuthor(req, res, client, collection, db);
})
// get all files from a subject
router.get('/subject/:subject', async (req, res) => {
    filesFromSubject(req, res, client, collection, db);
})
// get all files from a lecture
router.get('/lecture/:lectureID', async (req, res) => {
    filesFromLecture(req, res, client, collection, db);
})
// get one file
router.get('/:id', async (req, res) => {
    oneFile(req, res, client, collection, db);
})


router.get('/health', async (req, res) => {
    try {
        await client.db('admin').command({ ping: 1 });
        return res.status(200).send('p_db_files is healthy and connected to DB');
    } catch (error) {
        console.error('p_db_files health check failed:', error);
        return res.status(500).send('p_db_files is unhealthy');
    }
});

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