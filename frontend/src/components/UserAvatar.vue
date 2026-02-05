<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  username: string;
}>();

const colors = [
  '#1abc9c', '#3498db', '#e74c3c', '#e67e22', '#f39c12',
  '#f1c40f', '#2ecc71', '#34495e', '#e91e63', '#9b59b6',
];

const initial = computed(() => props.username.charAt(0).toUpperCase());

const backgroundColor = computed(() => {
  const firstChar = props.username.charAt(0).toLowerCase();
  const index = firstChar.charCodeAt(0) - 97;
  return colors[index % colors.length];
});
</script>

<template>
  <div class="user-avatar" :style="{ backgroundColor }">
    {{ initial }}
  </div>
</template>

<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}
</style>
