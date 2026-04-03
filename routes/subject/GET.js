
export default async function filesFromSubject(req, res, client, collection, db) {
    let subject;
    if (req.params.subject === undefined) {
        return res.status(400).send('No valid subject found');
    } else {
        subject = req.params.subject;
    }
    try {
        const data = await db.collection(collection)
            .find({subject: subject}) // Find subscriptions where the subscriber is the user
            .toArray();
        return res.status(200).send({files: data});
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}