import {Args, Mutation, Query, Resolver} from 'type-graphql'
import {UserNew} from '../entity/User'
import {UserCreateInput, UserSearchInput} from './inputs'

@Resolver()
export class UserResolver {
	
	@Query(returns => [UserNew])
	async users(@Args() input: UserSearchInput) {
		
		// TODO Like for strings
		return await UserNew.find(input)
	}
	
	@Mutation(returns => UserNew)
	async userCreate(@Args() input: UserCreateInput) {
		const isDupe = (await UserNew.find({email: input.email})).length !== 0
		
		if (isDupe) throw new Errors.Validation("Email exists")
		return await UserNew.create(input).save()
	}
}



export const Errors = {
	Validation: CustomError('ValidationError', 'Unspecified validation error')
}

function CustomError(name: string, defaultMessage: string) {
	return class ExpectedError extends Error {
		constructor(message: string = defaultMessage) {
			super(message)
			this.name = name
		}
	}
}
