
export default async function deleteHandler(req, res, client, collection, db) {
    let fileID;
    if (req.params.fileid === undefined) {
        return res.status(400).send('No valid fileID found');
    } else {
        fileID = parseInt(req.params.fileid)
    }
    if (!fileID ||isNaN(fileID)) {
        return res.status(400).send({message: "fileID has to be an integer"})
    }
    if (fileID < 0) {
        return res.status(400).send({message: "fileID has to be > 0"})
    }
    try {
        if (await db.collection(collection).findOne({id: fileID})) {
            await db.collection(collection).deleteOne({id: fileID})
            return res.status(200).send({message: "file-entry successfully deleted from database"});
        } else {
            return res.status(404).send({message: "fileID doesn't exist"})
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}