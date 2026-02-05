<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import TodoItem from './TodoItem.vue';
import { useTodoValidation } from '../composables/useTodoValidation';
import type { TodoPriority } from '../types';

const todoStore = useTodoStore();
const authStore = useAuthStore();
const { errors, validateTodo } = useTodoValidation();

const isFormExpanded = ref(false);
const isEditing = computed(() => todoStore.editingTodo !== null);

const newTodoTitle = ref('');
const newTodoContent = ref('');
const newTodoPriority = ref<TodoPriority>('low');
const newTodoExecutionDate = ref<Date | null>(null);

const TODO_TITLE_MAX_LENGTH:number = 49;
const TODO_CONTENT_MAX_LENGTH:number = 255;

onMounted(() => {
  todoStore.fetchTodos();
});

watch(() => todoStore.editingTodo, (todo) => {
  if (todo) {
    newTodoTitle.value = todo.title;
    newTodoContent.value = todo.content;
    newTodoPriority.value = todo.priority;
    newTodoExecutionDate.value = todo.executionDate;
    isFormExpanded.value = true;
  }
}, { immediate: true });

const isFormValid = computed(() => {
  return newTodoTitle.value.trim().length > 0 &&
         newTodoTitle.value.length <= TODO_TITLE_MAX_LENGTH &&
         newTodoContent.value.trim().length > 0 &&
         newTodoContent.value.length <= TODO_CONTENT_MAX_LENGTH;
});

async function addTodo() {
  if(!validateTodo(newTodoTitle.value, newTodoContent.value)) return;

  if(newTodoExecutionDate.value === '')
  {
    newTodoExecutionDate.value = null;
  }

  if(isEditing.value) // edit
  {
    await todoStore.updateTodo(todoStore.editingTodo!.id, {
      title: newTodoTitle.value,
      content: newTodoContent.value,
      priority: newTodoPriority.value,
      executionDate: newTodoExecutionDate.value,
      checked:todoStore.editingTodo!.checked
    });

    cancelAdd();
  }
  else // add
  {
    await todoStore.addTodo({
      title: newTodoTitle.value,
      content: newTodoContent.value,
      priority: newTodoPriority.value,
      executionDate: newTodoExecutionDate.value,
      checked: false,
    });
  }
}

function cancelAdd() {
  isFormExpanded.value = false;
  newTodoTitle.value = '';
  newTodoContent.value = '';
  newTodoPriority.value = 'low';
  newTodoExecutionDate.value = null;
  errors.value = {};
  todoStore.setEditingTodo(null);
}

</script>

<template>
  <div class="todo-container">
    <div class="header">
      <h1>Mes #TODOs</h1>
      <button @click="authStore.logout" class="btn-logout">Déconnexion</button>
    </div>

    <form @submit.prevent="addTodo" class="add-todo" :class="{ 'editing-mode': isEditing }">
      <div class="field-group">
        <label class="field-label">Titre</label>
        <div class="input-wrapper">
          <input
            v-model="newTodoTitle"
            @focus="isFormExpanded = true"
            placeholder="#TODO - Titre"
            class="input"
            :class="{ 'input-error': errors.title }"
            :maxlength="TODO_TITLE_MAX_LENGTH"
          />
          <span class="char-counter" :class="{ warning: newTodoTitle.length > TODO_TITLE_MAX_LENGTH * 0.8 }">
            {{ newTodoTitle.length }}/{{ TODO_TITLE_MAX_LENGTH }}
          </span>
        </div>
        <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
      </div>

      <Transition name="slide">
        <div v-if="isFormExpanded" class="expanded-fields">
          <div class="field-group">
            <label class="field-label">Contenu</label>
            <div class="input-wrapper">
              <textarea
                v-model="newTodoContent"
                placeholder="#TODO - Description"
                class="input textarea"
                :class="{ 'input-error': errors.content }"
                rows="4"
                :maxlength="TODO_CONTENT_MAX_LENGTH"
              />
              <span class="char-counter textarea-counter" :class="{ warning: newTodoContent.length > TODO_CONTENT_MAX_LENGTH * 0.9 }">
                {{ newTodoContent.length }}/{{ TODO_CONTENT_MAX_LENGTH }}
              </span>
            </div>
            <p v-if="errors.content" class="error-message">{{ errors.content }}</p>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Priorité</label>
              <select v-model="newTodoPriority" class="input select">
                <option value="low">🟢 Basse</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
            </div>

            <div class="field-group">
              <label class="field-label optional-label">
                Date d'exécution <span class="optional-tag">(optionnel)</span>
              </label>
              <input
                v-model="newTodoExecutionDate"
                type="date"
                class="input optional-input"
              />
            </div>
          </div>

          <div class="form-actions">
            <p v-if="errors.title || errors.content" class="error-inline">
              {{ errors.title || errors.content }}
            </p>
            <div class="buttons-group">
              <button
                type="submit"
                :class="isEditing ? 'btn-modify' : 'btn-add'"
                :disabled="!isFormValid"
              >
                {{ isEditing ? 'Modifier' : 'Ajouter' }}
              </button>
              <button type="button" @click="cancelAdd" class="btn-cancel">Annuler</button>
            </div>
          </div>
        </div>
      </Transition>
    </form>

    <div v-if="todoStore.loading" class="loading">Loading...</div>

    <div v-else-if="todoStore.error" class="error">
      {{ todoStore.error }}
    </div>

    <div v-else-if="todoStore.sortedTodos.length === 0" class="empty">
      No #TODO right now
    </div>

    <div v-else class="todo-list">
      <TodoItem
        v-for="todo in todoStore.sortedTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: #ffffff;
}

.btn-logout {
  padding: 8px 16px;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  color: #b183ed;
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
}

.optional-label {
  color: #888;
}

.optional-tag {
  font-size: 12px;
  font-weight: normal;
  font-style: italic;
  color: #666;
}

.optional-input {
  border-style: dashed !important;
  opacity: 0.8;
}

.input-wrapper {
  position: relative;
}

.char-counter {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 11px;
  color: #888;
  background: rgba(42, 42, 42, 0.8);
  padding: 2px 6px;
  border-radius: 3px;
  pointer-events: none;
}

.char-counter.warning {
  color: #ffa500;
  font-weight: bold;
}

.textarea-counter {
  bottom: 8px;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.buttons-group {
  display: flex;
  gap: 10px;
}

.error-inline {
  color: #f56565;
  font-size: 14px;
  margin: 0;
  flex: 1;
}

.btn-add:disabled,
.btn-modify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-todo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #b183ed;
}

.add-todo.editing-mode {
  border: 2px solid #42b883;
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
}

.expanded-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-add {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-modify {
  padding: 12px 24px;
  background: #d6850a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.error-message {
  color: #f56565;
  font-size: 14px;
  margin-top: -8px;
}

.input-error {
  border-color: #f56565 !important;
}

.input {
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  background-color: #3f3f3f;
  border: 1px solid #b183ed;
  color: #ffffff;
  min-width: 100%;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #718096;
}
</style>
