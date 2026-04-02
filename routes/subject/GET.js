
export default async function filesFromSubject(req, res, client, collection, db) {
    let subject;
    if (req.params.id === undefined) {
        return res.status(400).send('No valid subject found');
    } else {
        subject = req.params.id;
    }
    if (!subject ||isNaN(subject)) {
        return res.status(400).send({message: "subject has to be an integer"})
    }
    try {
        const data = await db.collection(collection)
            .find({subjectID: subject}) // Find subscriptions where the subscriber is the user
            .toArray();
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}