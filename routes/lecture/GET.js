
export default async function filesFromLecture(req, res, client, collection, db) {
    let lectureID;
    if (req.params.id === undefined) {
        return res.status(400).send('No valid lectureID found');
    } else {
        lectureID = parseInt(req.params.id)
    }
    if (!lectureID ||isNaN(lectureID)) {
        return res.status(400).send({message: "lectureID has to be an integer"})
    }
    if (lectureID < 0) {
        return res.status(400).send({message: "lectureID has to be > 0"})
    }
    try {
        const data = await db.collection(collection)
            .find({lectureID: lectureID}) // Find subscriptions where the subscriber is the user
            .toArray();
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}