const sdk = require('node-appwrite');
const formidable = require('formidable'); // Use formidable for parsing form data

module.exports = async function ({req, res}) {
    try {
        const client = new sdk.Client();
        const storage = new sdk.Storage(client);

        client
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('66b0ff530019305177ae')
            .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');

        const fileId = sdk.ID.unique();
        const bucketId = '66d9dd600031db125daf';

        // Parse the form data
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            
            if (err) {
                console.error('Error parsing form data:', err);
                return res.json({
                    success: false,
                    message: 'Error parsing form data',
                    error: err.toString(),
                });
            }

            // Assuming you're uploading a single file named 'profileFromStorage'
            const uploadedFile = files.profileFromStorage; 

            if (!uploadedFile) {
                return res.json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const fileType = uploadedFile.mimetype; 
            const fileName = uploadedFile.originalFilename;

            try {
                // Read the file into a buffer
                const fileData = await fs.promises.readFile(uploadedFile.filepath);

                // Upload the file to Appwrite Storage
                const result = await storage.createFile(
                    bucketId,
                    fileId,
                    fileData,
                    fileName,
                    ['role:all']
                );

                if (result) {
                    console.log('Image uploaded successfully:', result);
                    return res.json({
                        success: true,
                        message: 'Image uploaded successfully',
                        result: result
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'Failed to upload image',
                    });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                return res.json({
                    success: false,
                    message: 'Error uploading image',
                    error: error.toString(),
                });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.json({
            success: false,
            message: 'Error',
            error: error.toString(),
        });
    }
};