
export default async function allFiles(req, res, client, collection, db) {
    try {
        const data = await db.collection(collection)
            .toArray();
        return res.status(200).send({ files: data });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({message: "error retrieving data from database"});
    }
}