package users

func (u *User) ToDto() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		DeletedAt: u.DeletedAt,
	}
}
