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
];

const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".heic", ".heif"];

const imageUploader = multer({
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
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
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

		return cb(new Error("Only image files (png, jpg, gif, svg, webp, heic, heif) are allowed!"));
	},
});

export default imageUploader;
