package users

import "context"

type UserService struct {
	userRepo *UserRepository
}

func NewUserService(userRepo *UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (us *UserService) Save(ctx context.Context, req User) (User, error) {
	return us.userRepo.Save(ctx, req)
}

func (us *UserService) GetByEmail(ctx context.Context, email string) (User, error) {
	return us.userRepo.GetByEmail(ctx, email)
}

func (us *UserService) RemoveById(ctx context.Context, userId string) error {
	return us.userRepo.RemoveById(ctx, userId)
}

func (us *UserService) UpdateById(ctx context.Context, user User) (User, error) {
	return us.userRepo.UpdateById(ctx, user)
}
