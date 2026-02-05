import {Entity, Enum, ManyToOne, PrimaryKey, Property} from '@mikro-orm/core'
import { User } from './user.entity';
import { TodoPriority } from '../../types';

@Entity()
export class Todo {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    author!: User;

    @Property()
    title!: string;

    @Property()
    content!: string;

    @Enum(() => TodoPriority)
    priority!: TodoPriority;

    @Property({ nullable: true })
    executionDate?: string;

    @Property({ default: false })
    checked!: boolean;

    @Property()
    createdAt: Date = new Date();
}
