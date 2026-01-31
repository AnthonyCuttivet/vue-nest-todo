import { Injectable } from "@nestjs/common";
import { CreateTodoDTO, UpdateTodoDTO } from "./dto/create-todo.dto";
import { Todo } from "src/database/entities/todo.entity";
import { TodoRepository } from "src/database/repositories/todo.repository";

@Injectable()
export class TodosService {
    constructor(private readonly todoRepository:TodoRepository) {}

    async getTodos() : Promise<Todo[]>
    {
        return this.todoRepository.fetchAllTodos();
    }

    async createTodo(dto: CreateTodoDTO): Promise<Todo>
    {
        return this.todoRepository.createTodo({ content: dto.content, checked: dto.checked });
    }

    async updateTodo(id:number, dto:UpdateTodoDTO) : Promise<Todo>
    {
        return this.todoRepository.updateTodo(id, dto);
    }

    async deleteTodo(id: number): Promise<void>
    {
        await this.todoRepository.deleteTodo(id);
    }
}
