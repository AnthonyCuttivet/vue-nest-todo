import { EntityManager, RequiredEntityData } from "@mikro-orm/postgresql";
import { Todo } from "../../database/entities/todo.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDTO, UpdateTodoDTO } from "src/todos/dto/create-todo.dto";

@Injectable()
export class TodoRepository {
  constructor(private readonly em: EntityManager) {}

  async fetchAllTodos(): Promise<Todo[]> {
    return this.em.find(Todo, {});
  }

  async createTodo(dto:CreateTodoDTO): Promise<Todo> {
    const todo = this.em.create(Todo, {
        content: dto.content,
        checked: dto.checked,
    } as RequiredEntityData<Todo>);

    this.em.persist(todo);
    return this.em.flush().then(() => todo);
  }

  async updateTodo(id:number, dto:UpdateTodoDTO) : Promise<Todo> {
    const todo = await this.em.findOneOrFail(Todo, { id });

    if(!todo){
      throw new NotFoundException('Todo ${id} not found');
    }

    if(todo.content != dto.content)
    {
      todo.content = dto.content;
    }

    if(todo.checked != dto.checked)
    {
      todo.checked = dto.checked;
    }

    return this.em.flush().then(() => todo);
  }

  async deleteTodo(id: number): Promise<void> {
    const todo = await this.em.findOneOrFail(Todo, { id });

    if(!todo){
      throw new NotFoundException('Todo ${id} not found');
    }

    await this.em.remove(todo);
    await this.em.flush();
  }
}
