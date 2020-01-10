import {Validator} from 'class-validator'
import {Arg, Authorized, Mutation, Query, Resolver} from 'type-graphql'
import {bb} from '../../../utils/libsExport'
import {AuthRoles} from '../auth/authRoles'
import {PaginatedUserResponse} from '@/graphql/type-graphql/paginatedResponse'
import {UserNew} from '../entity/User'
import {Errors, userNotFoundError} from '@/utils/Errors'
import {generateMockUsers} from '../lib/generateMockUsers'
import {UserCreateInput, UserModifyInput, UserSearchInput} from '../inputs'
export const validator = new Validator()

export const yearBorn = (age: number) => new Date().getFullYear() - age


@Resolver()
export class UserResolver {
	@Mutation(returns => [UserNew])
	async generateMockUsers(@Arg('amount') amount: number) {
		const {generated} = await generateMockUsers(amount)
		return generated
	}
	
	@Authorized<AuthRoles[]>([AuthRoles.ADMIN])
	@Query(returns => PaginatedUserResponse)
	async usersPaginated(
		@Arg('upTo', {nullable: true}) upTo: number,
		@Arg('startAt', {nullable: true}) startAt: number): Promise<PaginatedUserResponse> {
		return {
			items  : await UserNew.find({take: upTo, skip: startAt}),
			total  : await UserNew.count(),
			hasMore: false, // TODO
		}
	}
	
	
	@Query(returns => [UserNew])
	async users(@Arg('searchBy', {nullable: true}) input: UserSearchInput) {
		// LikeWrapper(input) // TODO make it work with enums, or create a separate middleware decorator for strings
		return await UserNew.find(input)
	}
	
	@Mutation(returns => UserNew)
	async userCreate(@Arg('userData') {age, ...rest}: UserCreateInput) {
		return await UserNew.create({yearBorn: yearBorn(age), ...rest}).save()
	}
	
	@Mutation(returns => UserNew)
	async userModify(@Arg('changes') {friendsIds, ...rest}: UserModifyInput,
	                 @Arg('userId') userId: string) {
		if (!(validator.isUUID(userId))) throw new Errors.Validation('Incorrect format for user ID')
		
			const user = await UserNew.findOne(userId)
		if (!user) throw userNotFoundError(userId)
		
		/**
		 * Handle friends
		 * for each friend in changes,
		 * fetch user and add it to changes
		 * if not found, throw
		 */
		const friends = friendsIds
			? await bb.reduce(friendsIds,
				async (total: UserNew[], id) => {
					const user = await UserNew.findOne(id)
					if (!user)  throw userNotFoundError(id)
					return total.concat(user)
				}, [],
			)
			: undefined
		
		return UserNew
			.merge(user, {...rest, friendsPrimary: friends})
			.save()
	}
	
}
