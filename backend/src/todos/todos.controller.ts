import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDTO, UpdateTodoDTO } from "./dto/todo.dto";
import { Todo } from "src/database/entities/todo.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getTodos(
        @Request() req
    ) : Promise<Todo[]>
    {
        return this.todosService.getTodos(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTodo(
        @Request() req,
        @Body() dto:CreateTodoDTO,
    ) : Promise<Todo>
    {
        return this.todosService.createTodo(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateTodo(
        @Request() req,
        @Param('id', ParseIntPipe) id:number,
        @Body() dto:UpdateTodoDTO,
    ) : Promise<Todo>
    {
        return this.todosService.updateTodo(id, dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTodo(
        @Request() req,
        @Param('id') id:number,
    ) : Promise<void>
    {
        await this.todosService.deleteTodo(id, req.user);
    }
}
