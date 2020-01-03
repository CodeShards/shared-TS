import * as Sentry from '@sentry/node'
import {ApolloServer} from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import Express, {ErrorRequestHandler} from 'express'
import session from 'express-session'
import 'reflect-metadata'
import {createConnection} from 'typeorm'
import {APOLLO_ENGINE_API_KEY, dsn, HOST, PORT} from '../config/_consts'
import {ORMConfig} from '../config/_typeorm'
import {DBRequestCounterService} from './__typeorm reference/Middleware/DBRequestCounter'
import {redis} from './redis'
import {formatError} from './utils/apollo, graphql/formatError'
import {errorMiddleware} from './utils/express/errorMiddleware'
import {log} from './utils/log'
import {createSchema} from './utils/type-graphql/createSchema'


export async function main() {
	// Sentry
	Sentry.init({dsn})
	
	// Express
	const app = Express()
	
	// Sentry Handler
	app.use(Sentry.Handlers.requestHandler())
	
	// Create DB connection
	const conn = await createConnection(ORMConfig)
	
	// Flush if not in production
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
		log.warn('resetting the DB')
		await conn.synchronize(true)
	}
	
	// Connect to Redis
	const RedisStore = connectRedis(session)
	
	//================================================================================
	// Apollo
	//================================================================================
	
	// Initialize Apollo
	const schema = await createSchema()
	const apolloServer = new ApolloServer({
		schema,
		formatError,
		context        : (ctx: any) => ctx,
		validationRules: [],
		engine: {
			apiKey: /*"service:gs-playground:nxu7GrQcuV5ESD0T_lLYvQ"*/APOLLO_ENGINE_API_KEY,
		}
	})
	
	
	// Express Middleware
	app
		.use(
			cors({
				credentials: true,
				/* origin     : 'http://localhost:3000'*/
			}))
		.use(
			session({
				store            : new RedisStore({
					client: redis as any
				}),
				name             : 'qid',
				secret           : 'aslkdfjoiq12312',
				resave           : false,
				saveUninitialized: false,
				cookie           : {
					httpOnly: true,
					secure  : process.env.NODE_ENV === 'production',
					maxAge  : 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
				}
			})
		)
	
	// Add middleware to Apollo
	apolloServer.applyMiddleware({app, cors: false})
	
	// Fallback
	app.get('*', (req, res) => res.send('Not found'))
		
		// Sentry error handler
		.use(Sentry.Handlers.errorHandler({
			shouldHandleError(error: Error): boolean {
				return true
			}
		}) as ErrorRequestHandler)
		
		// my error handler
		.use(errorMiddleware)
	
	
	// flush initial DB setup count
	DBRequestCounterService.connect().clearCount()
	
	return app.listen(PORT, () => {
		Sentry.captureMessage('Up')
		log.success(`server started on http://${HOST}:${PORT}/graphql`)
	})
}
