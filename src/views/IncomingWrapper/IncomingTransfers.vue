<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-shield-plus"></i>
      </span>

      <div>
        <h2 class="h5 fw-bold m-2">سجل</h2>
        <small class="text-muted">متابعة وإدارة سجل تأييدات الإصابة</small>
      </div>
    </div>
  </div>

  <!-- Table Card -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة سجل (ترحيلات الوارد)</h5>
    </div>

    <div class="card-body position-relative">
      <!-- Loading -->
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
      </div>

      <div class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>أسماء الجرحى</th>
                <th>عدد الوارد</th>
                <th>تاريخ الوارد</th>
                <th>الشعبة المستلمة</th>
                <th>الحالة</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(x, idx) in transfers" :key="x.id">
                <td>{{ (page - 1) * pageSize + idx + 1 }}</td>

                <td>
                  <div v-if="x.incoming?.injuredNames?.length">
                    <div
                      v-for="(name, i) in x.incoming.injuredNames.slice(0, 2)"
                      :key="i"
                    >
                      • {{ name }}
                    </div>

                    <small
                      v-if="x.incoming.injuredNames.length > 2"
                      class="show-more"
                      style="cursor: pointer"
                      @click="openNamesModal(x.incoming.injuredNames)"
                    >
                      عرض الكل ({{ x.incoming.injuredNames.length }})
                    </small>
                  </div>

                  <span v-else>—</span>
                </td>

                <td>{{ x.incoming?.incomingBookNumber ?? "—" }}</td>

                <td>
                  {{
                    x.incoming?.incomingDate
                      ? formatDate(x.incoming.incomingDate)
                      : "—"
                  }}
                </td>

                <td class="fw-bold">{{ x.departmentName || "—" }}</td>

                <td>
                  <span v-if="x.status === 0" class="badge bg-secondary">
                    <i class="bi bi-hourglass-split"></i>
                    قيد الانتظار
                  </span>

                  <span v-else-if="x.status === 1" class="badge bg-success">
                    <i class="bi bi-check-circle-fill"></i>
                    مقبول
                  </span>

                  <span v-else-if="x.status === 2" class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i>
                    مرفوض
                  </span>

                  <span v-else class="badge bg-dark">غير معروف</span>
                </td>
              </tr>

              <tr v-if="transfers.length === 0">
                <td colspan="6" class="py-5 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد بيانات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
      <!-- Pagination -->
      <nav
        ref="paginationRef"
        class="circle-pagination d-flex justify-content-center mt-4"
      >
        <button
          class="page-btn"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>

        <button
          v-for="p in visiblePages"
          :key="p"
          class="page-number"
          :class="{ active: p === page }"
          @click="changePage(p)"
        >
          {{ p }}
        </button>

        <button
          class="page-btn"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      </nav>
    

  <!-- Names Modal (عرض كل الأسماء) -->
  <div class="modal fade" tabindex="-1" ref="namesModal">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">أسماء الجرحى</h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(name, i) in allNames"
            :key="i"
            class="name-item border-bottom py-2"
          >
            • {{ name }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeNamesModal">إغلاق</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { errorAlert } from "@/utils/alert.js";
import { Modal } from "bootstrap";
import {
  getIncomingTransfers,
  getIncomings,
} from "@/services/incoming.service.js";

// ==============================
// State
// ==============================
const transfers = ref([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const paginationRef = ref(null);

// ==============================
// Pagination
// ==============================
const visiblePages = computed(() => {
  const pages = [];
  let start = page.value - 1;
  if (start < 1) start = 1;

  let end = start + 2;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - 2);
  }

  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const focusPagination = async () => {
  await nextTick();
  paginationRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

// ==============================
// Helpers
// ==============================
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const loadAllIncomingsMap = async () => {

  const res = await getIncomings({
    pageNumber: 1,
    pageSize: 100,
  });

  const list = res.data.data || [];

  const map = new Map();
  list.forEach((inc) => {
    map.set(inc.id, inc);
  });

  return map;
};

// ==============================
// Load Transfers + Attach Incoming Info
// ==============================
const loadTransfers = async () => {
  loading.value = true;

  try {
    const res = await getIncomingTransfers({
      pageNumber: page.value,
      pageSize,
    });

    const list = res.data.data || [];
    totalPages.value = res.data.pagination?.totalPages || 1;
    const incomingsMap = await loadAllIncomingsMap();
    transfers.value = list.map((t) => ({
      ...t,
      incoming: incomingsMap.get(t.incomingId) || null,
    }));
  } catch (e) {
    console.error(e);
    errorAlert("فشل تحميل المراسلات");
  } finally {
    loading.value = false;
  }
};

// ==============================
// Change Page
// ==============================
const changePage = async (p) => {
  if (p < 1 || p > totalPages.value) return;

  page.value = p;
  await loadTransfers();
  await focusPagination();
};

// ==============================
// Names Modal (عرض كل أسماء الجرحى)
// ==============================
const allNames = ref([]);
const namesModal = ref(null);
let namesModalInstance = null;

const openNamesModal = (names = []) => {
  allNames.value = Array.isArray(names) ? names : [];
  namesModalInstance?.show();
};

const closeNamesModal = () => {
  namesModalInstance?.hide();
};

// ==============================
// Mounted
// ==============================
onMounted(() => {
  loadTransfers();
  namesModalInstance = new Modal(namesModal.value);
});
</script>
