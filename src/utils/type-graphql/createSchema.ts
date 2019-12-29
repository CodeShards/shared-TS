import {buildSchema} from 'type-graphql'
import {ErrorInterceptor} from '../../__typeorm reference/Middleware/errorInterceptor'
import {ExampleEntityResolver} from '../../__typeorm reference/Resolver'
import {UserResolver} from '../../__typeorm reference/User/resolver'
import {AuthorBookResolver} from '../../modules/author-book/AuthorBookResolver'
import {TagResolver, TaskResolver} from '../../modules/KBF'
import {AlbumResolver, PhotoResolver} from '../../modules/Photos'
import {ChangePasswordResolver} from '../../modules/user/ChangePassword'
import {ConfirmUserResolver} from '../../modules/user/ConfirmUser'
import {CreateProductResolver, CreateUserResolver} from '../../modules/user/CreateUser'
import {ForgotPasswordResolver} from '../../modules/user/ForgotPassword'
import {LoginResolver} from '../../modules/user/Login'
import {LogoutResolver} from '../../modules/user/Logout'
import {MeResolver} from '../../modules/user/Me'
import {ProfilePictureResolver} from '../../modules/user/ProfilePicture'
import {RegisterResolver} from '../../modules/user/Register'

export const createSchema = () =>
	buildSchema({
		emitSchemaFile: "./src/__tests__/schema.graphql", // for testing
		validate: true,
		globalMiddlewares: [ErrorInterceptor],
		
		resolvers  : [
			UserResolver,
			TagResolver,
			TaskResolver,
			
			// ExampleEntityResolver,
			// PhotoResolver,
			// AlbumResolver,
			// ChangePasswordResolver,
			// ConfirmUserResolver,
			// ForgotPasswordResolver,
			// LoginResolver,
			// LogoutResolver,
			// MeResolver,
			// RegisterResolver,
			// CreateUserResolver,
			// CreateProductResolver,
			// ProfilePictureResolver,
			// AuthorBookResolver
		],
		authChecker: ({context: {req}}) => {
			return !!req.session.userId
		}
	})
