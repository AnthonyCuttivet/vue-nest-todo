<script setup lang="ts">
import { useAuthStore } from './stores/authStore';
import LoginForm from './components/LoginForm.vue';
import TodoList from './components/TodoList.vue';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});

</script>

<template>
  <div id="app">
    <div v-if="authStore.isChecking" class="checking-auth">
      <div class="spinner"></div>
      <p>Vérification...</p>
    </div>
    <LoginForm v-if="!authStore.isAuthenticated" />
    <TodoList v-else />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #121212;
}

#app {
  min-height: 100vh;
  padding: 20px;
}

.checking-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #888;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #2a2a2a;
  border-top-color: #b183ed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

</style>
