import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("file"); // Make sure "file" is correct

export { singleUpload };
