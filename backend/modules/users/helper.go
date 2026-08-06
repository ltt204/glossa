package users

func ToDto(user User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		DeletedAt: user.DeletedAt,
	}
}
