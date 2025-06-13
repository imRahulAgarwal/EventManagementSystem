import multer from "multer";
import fs from "fs";
import path from "path";

const allowedMimeTypes = ["video/mp4", "video/quicktime"];

const allowedExtensions = [".mp4", ".mov"];

const videoUploader = multer({
	storage: multer.diskStorage({
		destination: async function (req, file, cb) {
			let tempUploadFolder = `uploads/${Date.now()}`;

			if (!fs.existsSync(tempUploadFolder)) {
				await fs.promises.mkdir(tempUploadFolder, { recursive: true });
			}

			cb(null, tempUploadFolder);
		},
		filename: function (req, file, cb) {
			const safeFileName = file.originalname.replace(/\s+/g, "_");
			const timestampedName = `${Date.now()}_${safeFileName}`;
			cb(null, timestampedName);
		},
	}),
	limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
	fileFilter: function (req, file, cb) {
		const ext = path.extname(file.originalname).toLowerCase();
		const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
		const isExtAllowed = allowedExtensions.includes(ext);

		if (isMimeAllowed && isExtAllowed) {
			return cb(null, true);
		}

		return cb(new Error("Only video files (mp4, mov) are allowed!"));
	},
});

export default videoUploader;
