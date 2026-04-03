
export default async function filesFromLecture(req, res, client, collection, db) {
    let lectureID;
    if (req.params.lectureID === undefined) {
        return res.status(400).send('No valid lectureID found');
    } else {
        lectureID = parseInt(req.params.lectureID)
    }
    if (!lectureID ||isNaN(lectureID)) {
        return res.status(400).send({message: "lectureID has to be an integer"})
    }
    if (lectureID < 0) {
        return res.status(400).send({message: "lectureID has to be > 0"})
    }
    try {
        const data = await db.collection(collection)
            .find({lectureID: lectureID})
            .project({_id: 0 }) // Select only 'userid', exclude '_id'
            .toArray();
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}