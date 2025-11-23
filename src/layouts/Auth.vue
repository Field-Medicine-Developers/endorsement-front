<template>
    <!-- Layout بسيط بدون Navbar أو Sidebar -->
    <div class="auth-layout">
      <router-view />
    </div>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped>
  .auth-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh; 
  }
  </style>
  