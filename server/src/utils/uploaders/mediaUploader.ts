import multer from "multer";
import fs from "fs";
import path from "path";

const allowedMimeTypes = [
	"image/png",
	"image/jpeg", // jpg, jpeg
	"image/gif",
	"image/svg+xml",
	"image/webp",
	"image/heic",
	"image/heif",
	"application/octet-stream", // we'll allow only if extension matches
	"video/mp4",
	"video/quicktime",
];

const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".heic", ".heif", ".mp4", ".mov"];

const mediaUploader = multer({
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
	limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
	fileFilter: function (req, file, cb) {
		const ext = path.extname(file.originalname).toLowerCase();
		const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
		const isExtAllowed = allowedExtensions.includes(ext);

		if (file.mimetype === "application/octet-stream") {
			// Allow only if extension is .heic or .heif
			if (ext === ".heic" || ext === ".heif") {
				return cb(null, true);
			}
			return cb(new Error("Unsupported file type."));
		}

		if (isMimeAllowed && isExtAllowed) {
			return cb(null, true);
		}

		return cb(new Error("Only media files (png, jpg, gif, svg, webp, heic, heif, mp4, mov) are allowed!"));
	},
});

export default mediaUploader;
