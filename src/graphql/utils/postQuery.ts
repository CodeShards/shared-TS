import {ASTNode, print} from 'graphql'
import request from 'graphql-request'
import {Variables} from 'graphql-request/dist/src/types'
import {AnyObject} from 'tsdef'
import {GQL_URL} from 'config/_consts'
import {Mutation, Query} from '@/graphql/generated/typings'
import {flattenObject} from '@/utils/zz_misc/flattenObject'


/**
 * Dispatch GQL query
 * @param url server url, defaults to GQL_URL env. variable
 * @param query graphql-tag gql\`{...}\` query
 * @param mainField select one field from respose object:
 * query "tasks" will respond with object `{tasks: [...]}`, and we would have to do `.then(value => value["tasks"])`.
 *   Specifying `"tasks"` in mainField parameter will return the array right away
 */

export async function postQuery<T = AnyObject[]> (
	query: ASTNode, mainField?: string, url: string = GQL_URL
): Promise<{ [key: string]: T }> {

	const res: AnyObject = await request(url, print(query))
	return mainField ? res?.[mainField] : res

}


export async function gqlRequest<T>(query: ASTNode, variables?: Variables, url?: string): Promise<T>
export async function gqlRequest<T, K>(query: ASTNode, variables?: Variables, url?: string): Promise<[T, K]>
export async function gqlRequest<T, K, U>(query: ASTNode, variables?: Variables, url?: string): Promise<[T, K, U]>


export async function gqlRequest<T, K, U> (
	query: ASTNode, variables?: Variables, url: string = GQL_URL
) {

	const res: AnyObject | unknown[] = await request(
		url, print(query), variables
	)

	return flattenObject(res)

}


type keyofQuery = keyof Omit<Query, '__typename'>
type keyofMutation = keyof Omit<Mutation, '__typename'>

// Single query
export async function gqlreq<T extends keyofQuery, R extends Query[T], V extends AnyObject>
(type: 'query', obj: T, query: ASTNode, variables?: V, url?: string): Promise<R>

// Single mutation
export async function gqlreq<T extends keyofMutation, R extends Mutation[T], V extends AnyObject>
(type: 'mutation', obj: T, query: ASTNode, variables?: V, url?: string): Promise<R>

export async function gqlreq (
	type: 'query' | 'mutation', obj: keyofMutation | keyofQuery, query: ASTNode, variables?: AnyObject, url: string = GQL_URL
) {

	const res = await request(
		url, print(query), variables
	)
	return flattenObject(res)

}
