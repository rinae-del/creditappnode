const { Client, Databases, Storage, ID, InputFile } = require('node-appwrite');
const formidable = require('formidable');

module.exports = async function ({ req, res }) {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('66b0ff530019305177ae')
        .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');

    const storage = new Storage(client);
    const databases = new Databases(client);

    // Create a new formidable instance to parse the form data
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.json({
                status: 'error',
                message: 'An error occurred while parsing form data: ss'
            });
        }

        // Extract the userId and file from the parsed data
        const userId = fields.userId;
        const avatarFile = files.avatar;

        if (!userId) {
            return res.json({
                status: 'error',
                message: 'User ID is required.'
            });
        }

        if (!avatarFile) {
            return res.json({
                status: 'error',
                message: 'No avatar file provided.'
            });
        }

        try {
            const newFile = await storage.createFile(
                '66d9dd600031db125daf',  // Replace with your bucket ID
                ID.unique(),
                InputFile.fromBuffer(await fs.promises.readFile(avatarFile.filepath), avatarFile.originalFilename)
            );

            // Retrieve the user document and update avatar if necessary
            const user = await databases.getDocument('66ba2aa70010f10f2b30', '66ba2ab5000c9d6e26aa', userId);

            if (user.avatar) {
                try {
                    await storage.deleteFile('66d9dd600031db125daf', user.avatar);
                } catch (error) {
                    console.log('Failed to delete old avatar:', error.message);
                }
            }

            await databases.updateDocument(
                '66ba2aa70010f10f2b30',
                '66ba2ab5000c9d6e26aa',
                userId,
                { avatar: newFile.$id }
            );

            return res.json({
                status: 'success',
                message: 'Avatar uploaded and user updated successfully.',
                avatarId: newFile.$id
            });

        } catch (error) {
            return res.json({
                status: 'error',
                message: 'An error occurred: ' + error.message
            });
        }
    });
};
