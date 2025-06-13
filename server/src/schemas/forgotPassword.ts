import { z } from "zod/v4";

const forgotPasswordSchema = z.object({
	email: z
		.email({
			error: (info) => {
				if (info.input === undefined) {
					return "Email is required!";
				} else if (info.code === "invalid_type") {
					return "Email must be a string!";
				} else if (info.code === "invalid_format") {
					return "Provide a valid email address!";
				}
			},
		})
		.toLowerCase(),
});

export default forgotPasswordSchema;
