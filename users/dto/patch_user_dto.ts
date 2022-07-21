import { PutUserDto } from './put_user_dto';

// For PATCH requests, use the Partial feature from TypeScript
// This creates a new type by copying another type and making all its fields optional. 
export interface PatchUserDto extends Partial<PutUserDto> {}