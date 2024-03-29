import { CreateUserDto } from '../dto/create_user_dto';
import { PatchUserDto } from '../dto/patch_user_dto';
import { PutUserDto } from '../dto/put_user_dto';
import { PatchableUserFields } from '../utils/enumerators';
import mongooseService from '../../common/services/mongoose_service';
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    constructor() {
        log('Created new instance of UsersDao');
    }

    userSchema = new this.Schema({
        _id: String,
        email: String,
        password: { type: String, select: false },
        firstName: String,
        lastName: String,
        permissionFlags: Number,
    }, { id: false })
    
    User = mongooseService.getMongoose().model('Users', this.userSchema);

    // Whatever the API consumer sends in for permissionFlags via userFields
    // We then override it with the value 1
    async addUser(userFields: CreateUserDto) {
        const userId = shortid.generate();
        const user = new this.User({
            _id: userId,
            ...userFields,
            permissionFlags: 1,
        });
        await user.save();
        return userId;
    }

    async getUserByEmail(email: string) {
        return this.User.findOne({ email: email }).exec();
    }
    
    async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).exec();
    }
    
    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();
    
        return existingUser;
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }
}

export default new UsersDao();