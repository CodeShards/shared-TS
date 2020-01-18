import {Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne} from 'typeorm'
import {Task} from '@/models/KBF/entity/Task'
import {ObjectType, Field} from 'type-graphql'
import {Board} from '@/models/KBF/entity/Board'


@Entity()
@ObjectType()
export class TColumn{
	@Field(returns => Board)
	@ManyToOne(type => Board, board => board.columns)
	board: Board
	
	@Field(returns => Task, {nullable: true})
	@OneToMany(type => Task, task => task.column)
	tasks: Task[]
	
}
