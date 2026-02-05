import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../types';
import { toast } from 'vue3-toastify';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const isChecking = ref(true);

  async function checkAuth() {
    const token = authService.getToken();
    if (!token)
    {
      isAuthenticated.value = false;
      isChecking.value = false;
      return;
    }
    try
    {
      isAuthenticated.value = true;
    }
    catch
    {
      authService.logout();
      isAuthenticated.value = false;
    }
    finally
    {
      isChecking.value = false;
    }
  }

  async function login(credentials: LoginCredentials) {
    try
    {
      const response = await authService.login(credentials);
      isAuthenticated.value = true;
      toast.success('Connecté');
    }
    catch(err)
    {
      toast.error('Identifiants incorrects');
    }

  }

  function logout() {
    authService.logout();
    isAuthenticated.value = false;
  }

  return { isAuthenticated, isChecking, checkAuth, login, logout };
});
