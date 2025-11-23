<template>
    <div class="d-flex">
      <!-- زر فتح/إغلاق -->
      <div class="sidebar-toggle p-2" @click="toggleSidebar">
        <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </div>
  
      <!-- السايد بار -->
      <div :class="['sidebar bg-light border-end', { 'collapsed': !isOpen }]">
        <ul class="list-unstyled m-0 p-3">
          <li v-for="route in routes" :key="route.path" class="mb-2">
            <router-link :to="route.path" class="d-flex align-items-center nav-link"
                         :class="{ active: isActive(route.path) }">
              <i class="bi bi-house me-2" v-if="route.path === `${siteUrl}/`"></i>
              <span v-if="isOpen">{{ route.children[0].name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
  
      <!-- المحتوى -->
      <div class="flex-grow-1 p-3">
        <router-view />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { routes } from "@/router";
  
  const siteUrl = import.meta.env.VITE_BUILD_ADDRESS;
  const router = useRouter();
  const activeRoute = computed(() => router.currentRoute.value.path);
  const isActive = (path: string) => path === activeRoute.value;
  
  // فتح/إغلاق السايد بار
  const isOpen = ref(true);
  const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style lang="scss" scoped>
  .sidebar {
    width: 220px;
    transition: all 0.3s ease-in-out;
    min-height: 100vh;
    background-color: #fff;
  
    &.collapsed {
      width: 60px;
  
      span {
        display: none;
      }
    }
  
    .nav-link {
      padding: 10px;
      border-radius: 6px;
      color: #333;
      transition: background 0.2s;
  
      &:hover {
        background: #f5f5f5;
      }
  
      &.active {
        background: #32817d;
        color: #fff;
      }
    }
  }
  
  .sidebar-toggle {
    position: absolute;
    left: 15px;
    top: 15px;
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 1000;
  }
  </style>
  