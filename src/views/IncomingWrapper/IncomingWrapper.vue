<template>
    <div class="flow-nav my-3">
  
      <!-- Left Icon -->
      <div class="left-side">
        <div class="left-icon">
          <i class="bi bi-inbox fs-5"></i>
        </div>
  
        <!-- Title -->
        <div class="title-badge">الوارد</div>
      </div>
  
      <!-- Tabs -->
      <div class="center-links">
        <div
          class="nav-item"
          :class="{ active: tab === 'public' }"
          @click="tab = 'public'"
        >
          الوارد
        </div>
  
        <div
          class="nav-item"
          :class="{ active: tab === 'secret' }"
          @click="tab = 'secret'"
        >
          الوارد السري
        </div>
        <div
        class="nav-item"
        :class="{ active: tab === 'transfers' }"
        @click="tab = 'transfers'"
      >
        سجل 
      </div>
      </div>
    </div>
  
    <!-- Dynamic Page -->
    <component :is="currentTab" :key="tab"></component>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import Incoming from "./Incoming.vue";
  import IncomingSecret from "./IncomingSecret.vue";
  import IncomingTransfers from "./IncomingTransfers.vue"; 
  
  const tab = ref("public");
  
  const currentTab = computed(() => {
    switch (tab.value) {
      case "public":
        return Incoming;
  
      case "secret":
        return IncomingSecret;

       case "transfers":
        return IncomingTransfers;
  
      default:
        return Incoming;
    }
  });
  </script>
  

  