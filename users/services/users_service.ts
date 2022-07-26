import UsersDao from '../dao/users_dao';
import { CRUD } from '../../common/interfaces/crud_interface';
import { CreateUserDto } from '../dto/create_user_dto';
import { PutUserDto } from '../dto/put_user_dto';
import { PatchUserDto } from '../dto/patch_user_dto';

class UsersService implements CRUD{
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }

    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async list(limit: number, page: number) {
        return UsersDao.getUsers(limit, page);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }

    async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.updateUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto) {
        return UsersDao.updateUserById(id, resource);
    }
}

export default new UsersService();