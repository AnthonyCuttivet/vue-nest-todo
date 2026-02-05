import {Collection, Entity, OneToMany, PrimaryKey, Property, Unique} from '@mikro-orm/core'
import { Todo } from './todo.entity';

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    @Unique()
    username!: string;

    @Property({hidden:true})
    password!: string;

    @OneToMany(() => Todo, todo => todo.author)
    todos = new Collection<Todo>(this);

    @Property({ onCreate: () => new Date() })
    createdAt: Date;
}
