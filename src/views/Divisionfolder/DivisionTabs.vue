<template>
  <div class="flow-nav my-3">
    <!-- Left Icon -->
    <div class="left-side">
      <div class="left-icon">
        <i class="bi bi-journal-check"></i>
      </div>
      <div class="title-badge">ملاحظات الأقسام</div>
    </div>

    <!-- Tabs -->
    <div class="center-links">
      <div
        class="nav-item"
        :class="{ active: tab === 'transactions' }"
        @click="tab = 'transactions'"
      >
        معاملات الشعبة
      </div>

      <div
        class="nav-item"
        :class="{ active: tab === 'correspondence' }"
        @click="tab = 'correspondence'"
      >
        المراسلات
      </div>
    </div>
  </div>

  <!-- Dynamic Pages -->
  <component :is="currentTab"></component>
</template>

<script setup>
import { ref, computed } from "vue";

import DivisionFlow from "@/views/Divisionfolder/DivisionFlow.vue";
import DivisionApproval from "@/views/Divisionfolder/DivisionApproval.vue";

const tab = ref("transactions");

const currentTab = computed(() => {
  switch (tab.value) {
    case "transactions":
      return DivisionFlow;

    case "correspondence":
      return DivisionApproval;

    default:
      return DivisionFlow;
  }
});
</script>
