
export default async function filesFromAuthor(req, res, client, collection, db) {
    let authorID;
    if (req.params.authorID === undefined) {
        return res.status(400).send('No valid authorID found');
    } else {
        authorID = parseInt(req.params.authorID)
    }
    if (!authorID ||isNaN(authorID)) {
        return res.status(400).send({message: "authorID has to be an integer"})
    }
    if (authorID < 0) {
        return res.status(400).send({message: "authorID has to be > 0"})
    }
    try {
        console.log(authorID);
        const data = await db.collection(collection)
            .find({authorID: authorID}) // Find files where the authorID is the author
            .project({_id: 0 }) // Select only 'userid', exclude '_id'
            .toArray();
        console.log(data);
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}