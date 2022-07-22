import { CreateUserDto } from '../dto/create_user_dto';
import { PatchUserDto } from '../dto/patch_user_dto';
import { PutUserDto } from '../dto/put_user_dto';
import { PatchableUserFields } from '../utils/enumerators';
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    users: Array<CreateUserDto> = [];

    constructor() {
        log('Created new instance of UsersDao');
    }

    
    async getUsers() {
        return this.users;
    }
    
    async getUserById(userId: string) {
        return this.users.find((user: { id: string }) => user.id === userId);
    }

    async getUserByEmail(email: string) {
        const objIndex = this.users.findIndex(
            (obj: { email: string }) => obj.email === email
        );
        let currentUser = this.users[objIndex];
        return currentUser;
    }
    
    async addUser(user: CreateUserDto) {
        user.id = shortid.generate();
        this.users.push(user);
        return user.id;
    }

    async putUserById(userId: string, user: PutUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        this.users.splice(objIndex, 1, user);
        return `${user.id} updated via put`;
    }

    async patchUserById(userId: string, user: PatchUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        let currentUser = this.users[objIndex];
        const allowedPatchFields = [
            PatchableUserFields.PASSWORD,
            PatchableUserFields.FIRSTNAME,
            PatchableUserFields.LASTNAME,
            PatchableUserFields.PERMISSIONLEVEL,
        ];
        for (let field of allowedPatchFields) {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }

    async removeUserById(userId: string) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }
}

export default new UsersDao();