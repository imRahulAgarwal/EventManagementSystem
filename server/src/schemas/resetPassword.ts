import { z } from "zod/v4";

const resetPasswordSchema = z
	.object({
		newPassword: z
			.string({
				error: (info) => {
					// Checks wether input is provided or is of type string
					if (info.input === undefined) {
						return "New Password is required!";
					} else if (info.code === "invalid_type") {
						return "New Password must be a string!";
					}
				},
			})
			.trim()
			.min(8, {
				abort: true,
				error: (info) => {
					// Checks wether the password character length is equal to or more than 8
					if (info.code === "too_small") {
						return "New Password must be minimum 8 characters long!";
					}
				},
			}),
		confirmPassword: z
			.string({
				error: (info) => {
					// Checks wether input is provided or is of type string
					if (info.input === undefined) {
						return "Confirm Password is required!";
					} else if (info.code === "invalid_type") {
						return "Confirm Password must be a string!";
					}
				},
			})
			.trim()
			.min(8, {
				abort: true,
				error: (info) => {
					// Checks wether the password character length is equal to or more than 8
					if (info.code === "too_small") {
						return "Confirm Password must be minimum 8 characters long!";
					}
				},
			}),
	})
	.refine((values) => values.newPassword === values.confirmPassword, {
		// Checks wether the values are equal or not
		error: "The passwords are not same!",
		path: ["confirmPassword"],
	});

export default resetPasswordSchema;
