



import AWS from 'aws-sdk';
import { toast } from 'react-toastify'; 

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'AKIAYZZGSXNZXIRZUEGE',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

export const uploadFile = async (file, folder) => {
  if (!file) throw new Error('File is required for upload');

  const params = {
    Bucket: 'supremebucket25',
    Key: `${folder}/${file.name}`, // File name with folder path
    Body: file, // File data
    ContentType: file.type, 
    // ACL: 'public-read', 
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('File uploaded successfully:', data.Location);
    toast.success( "file upload successfully!");

    return data.Location; // Return the file's URL
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};
