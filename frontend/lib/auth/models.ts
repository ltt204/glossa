import z from 'zod'

export const UserSchema = z.object({
	id: z.string(),
	email: z.string(),
})

export const SignInResponseSchema = z.object({
	user: UserSchema,
	accessToken: z.string(),
	refreshToken: z.string(),
})

export const SignUpResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>
