package users

// goverter:converter
// goverter:skipCopySameType
// goverter:output:file ./user_converter_gen.go
type UserConverter interface {
	ToDTO(source User) UserResponse

	//goverter:ignore ID CreatedAt UpdatedAt DeletedAt
	ToEntity(source CreateUserRequest) User
}
