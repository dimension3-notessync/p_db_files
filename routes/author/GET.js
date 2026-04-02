
export default async function filesFromAuthor(req, res, client, collection, db) {
    let authorID;
    if (req.params.id === undefined) {
        return res.status(400).send('No valid authorid found');
    } else {
        authorID = parseInt(req.params.id)
    }
    if (!authorID ||isNaN(authorID)) {
        return res.status(400).send({message: "authorid has to be an integer"})
    }
    if (authorID < 0) {
        return res.status(400).send({message: "authorid has to be > 0"})
    }
    try {
        const data = await db.collection(collection)
            .find({authorID: authorID}) // Find subscriptions where the subscriber is the user
            .toArray();
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}