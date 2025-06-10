import fs from "fs";
import path from "path";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a media file to Cloudinary.
 *
 * @param filePath The path to the file to upload.
 * @param options Optional Cloudinary upload options.
 * @returns A Promise that resolves with the Cloudinary upload result or rejects with an error.
 */
export async function uploadMedia(filePath: string, options?: UploadApiOptions): Promise<UploadApiResponse> {
	try {
		// Check if the file exists and is readable
		await fs.promises.access(filePath, fs.constants.R_OK);
	} catch (error: any) {
		throw error;
	}

	const originalName: string = path.basename(filePath);

	// Sanitize the original filename to create a "harder" (more robust) safeName for the public ID.
	// This replaces non-alphanumeric characters (excluding dots and dashes, which Cloudinary allows)
	// and multiple underscores with a single underscore. It also trims leading/trailing underscores.
	const safeName: string = originalName
		.replace(/[^a-zA-Z0-9.\-]+/g, "_") // Replace non-allowed characters with underscore
		.replace(/_+/g, "_") // Replace multiple underscores with a single one
		.replace(/^_|_$/g, ""); // Trim leading/trailing underscores

	// Generate a unique public ID using a timestamp and the sanitized filename.
	// This ensures uniqueness and readability.
	const cloudinaryPublicId: string = `${Date.now()}_${safeName}`;

	// Create a readable stream from the file
	const readFileStream: fs.ReadStream = fs.createReadStream(filePath);

	return new Promise<UploadApiResponse>((resolve, reject) => {
		// Use cloudinary.uploader.upload_stream to pipe the file directly.
		// Default options are applied here, which can be overridden by the 'options' parameter.
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				public_id: cloudinaryPublicId,
				resource_type: "auto", // Automatically detect resource type (image, video, raw).
				// This is a good default as it handles different file types.
				unique_filename: true, // Ensures a unique filename even if public_id isn't fully unique
				// by adding a random suffix. Highly recommended.
				overwrite: false, // Prevents overwriting existing assets with the same public_id.
				// Set to 'true' only if overwriting is explicitly desired.
				folder: undefined, // Optional: specify a folder name within Cloudinary.
				// e.g., 'my-app-uploads'. If not provided, it defaults to the root.
				tags: [], // Optional: array of tags for categorization.
				// e.g., ['typescript', 'example'].
				...options, // Spread any additional options provided by the caller,
				// allowing them to override default settings.
			} as UploadApiOptions, // Explicitly cast to UploadApiOptions to ensure type compatibility
			(error: Error | undefined, result: UploadApiResponse | undefined) => {
				if (error) {
					return reject(error); // Reject the Promise if an error occurs during upload.
				}
				if (!result) {
					// This case should ideally not happen if no error is thrown, but good for type safety.
					const noResultError = new Error("Cloudinary upload did not return a result.");
					return reject(noResultError);
				}

				resolve(result); // Resolve the Promise with the successful upload result.
			}
		);

		// Handle errors from the file read stream.
		readFileStream.on("error", (streamError: Error) => {
			reject(streamError); // Reject the Promise if there's an error reading the file.
		});

		// Pipe the file stream to the Cloudinary upload stream to start the upload.
		readFileStream.pipe(uploadStream);
	});
}
