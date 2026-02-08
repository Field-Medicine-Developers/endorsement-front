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

  <!-- Search Bar -->
<div class="card shadow-sm border-0 mb-3 p-3">
  <div class="row g-3">
    <div class="col-md-6">
      <input
        v-model="filters.injuredName"
        class="form-control"
        placeholder="بحث باسم الجريح..."
        @keyup.enter="applySearch"
      />
    </div>

    <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
      <button class="btn-search" @click="applySearch">بحث</button>
      <button class="btn-advanced" @click="openAdvanced">بحث متقدم</button>
      <button class="btn-advanced" @click="resetFilters">
        إعادة تعيين
      </button>
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
                <!-- <th>النوع</th> -->
                <th>عدد الوارد</th>
                <th>تاريخ الوارد</th>
                <th>عدد الكتاب</th>
                <th>تاريخ الكتاب</th>
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
                <!-- <td>{{ typeNameText(x.typeName) }}</td> -->
                <td>{{ x.incoming?.incomingBookNumber ?? "—" }}</td>

                <td>
                  {{
                    x.incoming?.incomingDate
                      ? formatDate(x.incoming.incomingDate)
                      : "—"
                  }}
                </td>

                <td>{{ x.bookCount ?? "—" }}</td>
                <td>{{ formatDate(x.bookDate) }}</td>

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

  <!-- Advanced Search Modal -->
<div class="modal fade" ref="advancedModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
      </div>

      <div class="modal-body">
        <div class="row g-3">

          <!-- عدد الوارد -->
          <div class="col-md-6">
            <label class="form-label">عدد الوارد</label>
            <input
              v-model.number="filters.incomingBookNumber"
              type="number"
              class="form-control"
            />
          </div>

          <!-- عدد الكتاب -->
          <div class="col-md-6">
            <label class="form-label">عدد الكتاب</label>
            <input
              v-model.number="filters.bookCount"
              type="number"
              class="form-control"
            />
          </div>

          <!-- تاريخ الكتاب -->
          <div class="col-md-6">
            <label class="form-label">تاريخ الكتاب</label>
            <input
              v-model="filters.bookDate"
              type="date"
              class="form-control"
            />
          </div>

          <!-- نوع صاحب المعاملة -->
          <!-- <div class="col-md-6">
            <label class="form-label">نوع صاحب المعاملة</label>
            <select v-model.number="filters.typeName" class="form-select">
              <option :value="null">الكل</option>
              <option :value="1">جريح</option>
              <option :value="2">منتسب</option>
            </select>
          </div> -->

          <!-- من تاريخ الوارد -->
          <div class="col-md-6">
            <label class="form-label">من تاريخ الوارد</label>
            <input
              v-model="filters.incomingDateFrom"
              type="date"
              class="form-control"
            />
          </div>

          <!-- الى تاريخ الوارد -->
          <div class="col-md-6">
            <label class="form-label">إلى تاريخ الوارد</label>
            <input
              v-model="filters.incomingDateTo"
              type="date"
              class="form-control"
            />
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-light" @click="closeAdvanced">إغلاق</button>
        <button class="btn btn-add" @click="applyAdvanced">بحث</button>
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
  const total = totalPages.value;
  const current = page.value;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set();

  pages.add(1);

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) {
      pages.add(i);
    }
  }
  pages.add(total);

  return [...pages].sort((a, b) => a - b);
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

      injuredName: filters.value.injuredName || null,
      incomingBookNumber: filters.value.incomingBookNumber ?? null,
      bookCount: filters.value.bookCount ?? null,
      bookDate: filters.value.bookDate || null,
      incomingDateFrom: filters.value.incomingDateFrom || null,
      incomingDateTo: filters.value.incomingDateTo || null,
      typeName: filters.value.typeName ?? null,
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

const filters = ref({
  injuredName: "",
  incomingBookNumber: null,
  bookCount: null,
  bookDate: "",
  incomingDateFrom: "",
  incomingDateTo: "",
  typeName: null,
});

const advancedModal = ref(null);
let modalAdv = null;

const openAdvanced = () => modalAdv.show();
const closeAdvanced = () => modalAdv.hide();
const applySearch = () => {
  page.value = 1;
  loadTransfers();
};

const applyAdvanced = () => {
  modalAdv.hide();
  page.value = 1;
  loadTransfers();
};


const resetFilters = () => {
  filters.value.injuredName = "";
  filters.value.incomingBookNumber = null;
  filters.value.bookCount = null;
  filters.value.bookDate = "";
  filters.value.incomingDateFrom = "";
  filters.value.incomingDateTo = "";
  filters.value.typeName = null;

  page.value = 1;
  loadTransfers();
};

const typeNameText = (v) => {
  if (v === 1) return "جريح";
  if (v === 2) return "منتسب";
  return "—";
};

// ==============================
// Mounted
// ==============================
onMounted(() => {
  loadTransfers();
  namesModalInstance = new Modal(namesModal.value);
  modalAdv = new Modal(advancedModal.value);
});
</script>
