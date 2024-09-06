const https = require('https');
const fs = require('fs');;
const { Client, Databases, Storage, ID, InputFile } = require('node-appwrite');

const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('66b0ff530019305177ae')
            .setKey('8fb30e76842b1ccd2131723bf09212db2ad90c019f9191bcfc001682739ecc9c7987543270cd706577be049314085d2175528006ea118dd4d5fa4d7249156d0d3f305c9a7da2c716cecb3302cb1abdcca8ec33cee1b730e3272708485abf8ca82ff2add77d34febb6d65da45945a7881e4c4038f8d924eaa4096fd11d70a53c9');


const storage = new Storage(client);

module.exports = async function ({req, res}) {
    const imageUrl = 'https://doc.nuxeo.com/assets/nxdoc/university/university-rest-api-importer.png';

    const tempFilePath = '/tmp/university-rest-api-importer.png';

    try {
        await new Promise((resolve, reject) => {
            https.get(imageUrl, (response) => {
                const file = fs.createWriteStream(tempFilePath);
                response.pipe(file);

                file.on('finish', () => {
                    file.close(resolve);
                });

                file.on('error', (err) => {
                    fs.unlink(tempFilePath, () => {}); 
                    reject(err);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });

        const bucketId = '66d9dd600031db125daf'; 
        const fileId = 'university-rest-api-importer.png'; 

        const fileStream = fs.createReadStream(tempFilePath);
        const result = await storage.createFile(bucketId, fileId, fileStream, 'image/png');
        
        fs.unlinkSync(tempFilePath);

        return res.json({
            success: true,
            result
        });
    } catch (error) {
        return res.json({
            success: false,
            error: error.message
        });
    }
};
