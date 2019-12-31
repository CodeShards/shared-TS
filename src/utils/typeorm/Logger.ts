import {Logger, QueryRunner} from 'typeorm'
import {DBRequestCounterService} from '../../__typeorm reference/Middleware/DBRequestCounter'
import {sig} from '../log'

export class CustomLogger implements Logger {
	
	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
	}
	
	logMigration(message: string, queryRunner?: QueryRunner): any {
	}
	
	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		// sig.debug(query)
		DBRequestCounterService.connect().increment()
	}
	
	logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
	}
	
	logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
	}
	
	logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
	
	}
	
	
}
