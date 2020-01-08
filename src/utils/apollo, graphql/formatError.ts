import * as Sentry from '@sentry/node'
import {ValidationError} from 'class-validator'
import {GraphQLError} from 'graphql'
import {flow, pick} from 'lodash'
import {MiddlewareFn} from 'type-graphql'
import {log} from '../libsExport'

export function formatError(err: GraphQLError) {
	Sentry.captureException(err)
	
	return flow(/*Augment,*/ ValidatorError)(err)
}


function Augment(err: GraphQLError) {
	if (err.extensions?.code) return String(err.extensions.code).toUpperCase()
	return err
	
}

function ValidatorError(err: GraphQLError) {
	const errors: ValidationError[] = err.extensions?.exception?.validationErrors
	if (errors) {
		return {
			message: err.message,
			errors : errors.map((err) =>
				pick(err, 'property', 'value', 'constraints'))
		}
	}
	return err
}

export const ErrorInterceptor2: MiddlewareFn = async (action, next) => {
	try {
		return await next()
	} catch (e) {
		if (e.constructor.name === 'ExpectedError') {
			log.error('Constructor ' + e.constructor.name)
			throw new Error('Intercepted: ' + e.message)
		} else {
			console.log(e)
			throw new Error('Uncaught error, ID has been recorded: ')
		}
	}
}
