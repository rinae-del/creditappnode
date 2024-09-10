const sdk = require('node-appwrite');

module.exports = async function ({req, res}) {
    try {
        const client = new sdk.Client();
        const storage = new sdk.Storage(client);

        client
            .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
            .setProject('66b0ff530019305177ae')         // Your Appwrite Project ID
            .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');                    // Your API Key

        const fileId = sdk.ID.unique();  // Generate a unique ID for the file
        const bucketId = '66d9dd600031db125daf'; // Your Appwrite bucket ID
        const uri = req.body.profileFromStorage; // The URI of the image to upload
        return res.json({
            success: true,
            message: 'Image uploaded successfully',
            body: req.body,
        });
        const match = /\.(\w+)$/.exec(uri);
        const fileType = match ? `image/${match[1]}` : `image/jpeg`;
        const fileName = `profile_picture.${match[1]}` || 'profile_picture.jpg';

        // Fetch the image from the provided URI
        const response = await fetch(uri);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        // Upload the file to Appwrite Storage
        const result = await storage.createFile(
            bucketId,
            fileId,
            buffer, 
            fileName, // File name
            ['role:all'] // Define permissions
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
};
