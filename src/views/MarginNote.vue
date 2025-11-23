<template>
  <!-- App Bar -->
  <div class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-2">
      <span class="appbar-icon d-inline-flex align-items-center justify-content-center">
        <i class="bi bi-receipt"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">إضافات الهامش</h2>
        <small class="text-muted">إضافة رقم الكتاب – التاريخ – الأصل</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="openAdd()">إضافة معلومات جديدة</button>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-4">
        <input v-model="filters.memoNumber" class="form-control" placeholder="بحث برقم الكتاب..." />
      </div>

      <div class="col-md-4">
        <input v-model="filters.memoDateFrom" type="date" class="form-control" />
      </div>

      <div class="col-md-4">
        <button class="btn btn-primary w-100" @click="load()">بحث</button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الإضافات</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border"></div>
      </div>

      <div v-else class="table-responsive">
        <table class="table custom-table text-center align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>رقم الكتاب</th>
              <th>تاريخ الكتاب</th>
              <th>ملف الأصل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(m, i) in list" :key="m.id">
              <td>{{ (page - 1) * pageSize + i + 1 }}</td>
              <td>{{ m.memoNumber }}</td>
              <td>{{ formatDate(m.memoDate) }}</td>
              <td>
                <span v-if="m.hasOriginalFile" class="badge bg-success">نعم</span>
                <span v-else class="badge bg-secondary">لا</span>
              </td>

              <td>
  <div class="d-flex justify-content-center gap-2">

    <!-- زر إضافة هامش -->
    <button class="button-add" @click="openAddFor(m.id)">
      ➕ إضافة
    </button>

    <!-- تعديل -->
    <button class="button-edit" @click="openEdit(m)">
      ✏️
    </button>

    <!-- حذف -->
    <button class="button" @click="remove(m.id)">
      🗑️
    </button>

  </div>
</td>

            </tr>

            <tr v-if="list.length === 0">
              <td colspan="6" class="py-4 text-muted">
                <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                لا توجد بيانات
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <nav class="circle-pagination d-flex justify-content-center mt-4">
    <button class="page-btn" :disabled="page === 1" @click="changePage(page - 1)">
      <i class="bi bi-chevron-right"></i>
    </button>

    <button
      class="page-number"
      v-for="p in visiblePages"
      :key="p"
      :class="{ active: p === page }"
      @click="changePage(p)"
    >
      {{ p }}
    </button>

    <button class="page-btn" :disabled="page === totalPages" @click="changePage(page + 1)">
      <i class="bi bi-chevron-left"></i>
    </button>
  </nav>

  <!-- Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "تعديل معلومات" : "إضافة معلومات" }}</h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">

              <div class="col-md-6">
                <label class="form-label">رقم الكتاب</label>
                <input v-model="form.memoNumber" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الكتاب</label>
                <input v-model="form.memoDate" type="date" class="form-control" required />
              </div>

              <div class="col-md-12">
                <label class="form-label">هل يوجد ملف أصل؟</label>
                <select v-model="form.hasOriginalFile" class="form-select">
                  <option :value="true">نعم</option>
                  <option :value="false">لا</option>
                </select>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" @click="close()">إلغاء</button>
            <button class="btn btn-add">{{ editMode ? "حفظ" : "إضافة" }}</button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

  
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import {
  getMarginAdditionalInfos,
  addMarginAdditionalInfo,
  updateMarginAdditionalInfo,
  deleteMarginAdditionalInfo
} from "@/services/margin-additional.service.js";

const list = ref([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const filters = reactive({
  memoNumber: "",
  memoDateFrom: "",
});

const modalEl = ref(null);
let modal = null;
const editMode = ref(false);

const form = reactive({
  id: "",
  memoNumber: "",
  memoDate: "",
  hasOriginalFile: false,
  marginNoteId: "" // سيتم ربطه لاحقاً من صفحة الهامش الإداري
});

// ========== LOAD ==========
import { useRoute } from "vue-router";
const route = useRoute();

const incomingId = route.query.incomingId;
const departmentId = route.query.departmentId;

const load = async () => {
  loading.value = true;
  try {
    const res = await getManagerNotes({
      pageNumber: 1,
      pageSize: 50,
      incomingId,
      departmentId
    });

    list.value = res.data.data;
  } finally {
    loading.value = false;
  }
};
const openAddFor = () => {
  editMode.value = false;
  reset();

  form.marginNoteId = `${incomingId}-${departmentId}`;

  modal.show();
};

// ========== PAGINATION ==========
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

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  load();
};

// ========== ACTIONS ==========
const openAdd = () => (
  editMode.value = false,
  reset(),
  modal.show()
);

const openEdit = (m) => (
  editMode.value = true,
  Object.assign(form, m),
  modal.show()
);

const save = async () => {
  if (!editMode.value) await addMarginAdditionalInfo(form);
  else await updateMarginAdditionalInfo(form.id, form);

  modal.hide();
  load();
};

const remove = async (id) => {
  await deleteMarginAdditionalInfo(id);
  load();
};

const reset = () => {
  form.id = "";
  form.memoNumber = "";
  form.memoDate = "";
  form.hasOriginalFile = false;
};

const close = () => modal.hide();

const formatDate = (d) =>
  new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(new Date(d));

onMounted(() => {
  modal = new Modal(modalEl.value);
  load();
});
</script>

  