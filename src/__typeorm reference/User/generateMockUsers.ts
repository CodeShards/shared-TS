import faker from 'faker'
import gql from 'graphql-tag'
import {times} from 'lodash'
import {gqlRequest} from '../../utils/apollo, graphql/postQuery'
import {TUserNew, UserNew} from '../entity/User'
import {Countries} from './CountriesList'

export async function generateMockUsers(amount: number) {
	const fakes = times(amount, num => ({
		firstName: faker.name.firstName(),
		lastName : faker.name.lastName(),
		password : faker.internet.password(),
		email    : faker.internet.exampleEmail(),
		country  : faker.random.arrayElement(Object.keys(Countries)),
		age      : faker.random.number(100)
	}))
  const query = gql`mutation userCreate($input: UserCreateInput!) {
      userCreate(userData: $input) {
		      createdDate
		      id
		      
		      
          firstName
          lastName
          password
          email
          country
          age
      }
  }`
	const generated = await Promise.all(fakes.map((fake) =>
		gqlRequest<TUserNew>(query, {input: fake})))
	
	return {
		fakes,
		generated
	}
}
