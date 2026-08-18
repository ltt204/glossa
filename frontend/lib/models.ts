import z from 'zod'

export const RefreshTokenResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>

export function createServerResponseSchema<T extends z.ZodType>(
	contentSchema: T,
) {
	return z.object({
		success: z.boolean(),
		message: z.string(),
		errorCode: z.string().optional(),
		timestamp: z.string().optional(),
		content: contentSchema.optional(),
	})
}

export type ServerResponse<T> = z.infer<
	ReturnType<typeof createServerResponseSchema<z.ZodType<T>>>
>
