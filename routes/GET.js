
export default async function oneFile(req, res, client, collection, db) {
    let fileID;
    if (req.params.id === undefined) {
        return res.status(400).send('No valid fileID found');
    } else {
        fileID = parseInt(req.params.id)
    }
    if (!fileID ||isNaN(fileID)) {
        return res.status(400).send({message: "fileID has to be an integer"})
    }
    if (fileID < 0) {
        return res.status(400).send({message: "fileID has to be > 0"})
    }
    try {
        const data = await db.collection(collection)
            .find({fileID: fileID}) // Find subscriptions where the subscriber is the user
            .toArray();
        return res.status(200).send({file: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}