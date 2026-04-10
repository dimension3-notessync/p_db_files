
export default async function insertHandler(req, res, client, collection, db){
    if (!req.body) {
        return res.status(400).send({ message: "Request body is missing" });
    }
    if (!req.body.lectureID) {
        return res.status(400).send({ message: "lectureID is missing" });
    }
    const lectureID = parseInt(req.body.lectureID);
    if (!req.body.authorID) {
        return res.status(400).send({ message: "authorID is missing" });
    }
    const authorID = parseInt(req.body.authorID);
    if (!req.body.fileName) {
        return res.status(400).send({ message: "fileName is missing" });
    }
    const fileName = req.body.fileName;
    if (!req.body.fileUrl) {
        return res.status(400).send({ message: "fileUrl is missing" });
    }
    const fileUrl = req.body.fileUrl;
    if (!req.body.subject) {
        return res.status(400).send({ message: "subject is missing" });
    }
    const subject = req.body.subject;
    if (!req.body.uploadTime) {
        return res.status(400).send({ message: "uploadTime is missing" });
    }
    const uploadTime = parseInt(req.body.uploadTime);
    const aiSummary = req.body.aiSummary || "No summary available";

    let id;
    try {
        const lecture = await db.collection(collection).find().sort({ id: -1 }).limit(1).toArray()
        if (lecture[0]) {
            const highestId = parseInt(lecture[0].id);
            id = highestId + 1;
        } else { id = 1; }

    } catch (error) {
        return res.status(500).send({message : "error retrieving data from database"});
    }

    const data = {
        id: id,
        lectureID: lectureID,
        authorID: authorID,
        fileName: fileName,
        fileUrl: fileUrl,
        subject: subject,
        uploadTime: uploadTime,
        aiSummary: aiSummary
    };

    try {
        await db.collection(collection).insertOne(data)
        return res.status(200).send({message: "Successfully added new file", id: id});
    }
    catch (error) {
        return res.status(500).send({message : "error inserting data in database"});
    }

}