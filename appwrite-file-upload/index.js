const sdk = require('node-appwrite');
const formidable = require('formidable');

module.exports = async function ({ req, res }) {
    try {
        const client = new sdk.Client();
        const storage = new sdk.Storage(client);

        client
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('66b0ff530019305177ae')
            .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');

        const fileId = sdk.ID.unique(); 
        const bucketId = '66d9dd600031db125daf'; 

        // Use formidable to parse the form data and extract the file
        const form = formidable({ multiples: true });

        await new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const file = files.profileFromStorage; // Assuming the file input name is 'profileFromStorage'

                    if (!file) {
                        throw new Error('No file uploaded');
                    }

                    // Get file information
                    const fileName = file.originalFilename || 'profile_picture.jpg';
                    const fileType = file.mimetype || 'image/jpeg'; 

                    // Upload the file to Appwrite Storage
                    const result = await storage.createFile(
                        bucketId,
                        fileId,
                        fs.createReadStream(file.filepath), // Read the file directly from its temporary path
                        fileName,
                        ['role:all']
                    );

                    if (result) {
                        console.log('Image uploaded successfully:', result);
                        res.json({
                            success: true,
                            message: 'Image uploaded successfully',
                            result: result
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Failed to upload image',
                        });
                    }

                    resolve();
                } catch (uploadError) {
                    reject(uploadError);
                }
            });
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.json({
            success: false,
            message: 'Error uploading image',
            error: error.toString(),
        });
    }
};