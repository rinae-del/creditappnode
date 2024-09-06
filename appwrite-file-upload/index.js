const sdk = require('appwrite');

module.exports = async function ({ req, res }) {
    const client = new sdk.Client();
    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('66b0ff530019305177ae')
        .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');

    const storage = new sdk.Storage(client);

    // Assuming you have a function trigger or middleware that parses the multipart/form-data request
    const file = req.files.avatar; // Get the file from the parsed request
    return res.json({ file });
    if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    try {
        const result = await storage.createFile(
            'YOUR_BUCKET_ID', // Replace with your actual bucket ID
            sdk.ID.unique(), // Generate a unique file ID
            file.data, 
            {
                'content-type': file.mimetype // Set the content type based on the uploaded file
            }
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
