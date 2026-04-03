
export default async function summaryUpdateHandler(req, res, client, collection, db) {
    if (!req.body) {
        return res.status(400).send({ message: "Request body is missing" });
    }
    if (!req.body.aiSummary) {
        return res.status(400).send({ message: "aiSummary is missing" });
    }
    const aiSummary = req.body.aiSummary;
    let fileID;
    if (!req.body.fileID) {
        return res.status(400).send('No valid fileID found');
    }
    fileID = parseInt(req.body.fileID);
    if (!fileID ||isNaN(fileID)) {
        return res.status(400).send({message: "fileID has to be an integer"})
    }
    if (fileID < 0) {
        return res.status(400).send({message: "fileID has to be > 0"})
    }

    try {
        if (await db.collection(collection).findOne({id: fileID})) {
            await db.collection(collection).updateOne({id: fileID}, {$set: {aiSummary: aiSummary}});
            return res.status(200).send({message: "file-entry successfully updated with aiSummary"});
        } else {
            return res.status(404).send({message: "fileID doesn't exist"})
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}