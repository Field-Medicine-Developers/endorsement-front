<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-diagram-3"></i>
      </span>

      <div>
        <h2 class="h5 fw-bold m-2">التشكيلات</h2>
        <small class="text-muted">إدارة تشكيلات الألوية والهيئات</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="openAdd()">إضافة تشكيل جديد</button>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3 align-items-end">
      <!-- الحقل -->
      <div class="col-md-6">
        <!-- <label class="form-label mb-1">بحث باسم التشكيل</label> -->
        <input
          v-model="filters.name"
          class="form-control"
          placeholder="ادخل اسم التشكيل..."
        />
      </div>

      <!-- الأزرار -->
      <div class="col-md-6 d-flex justify-content-end gap-2">
        <button class="btn-search" @click="load()">بحث</button>

        <button class="btn-advanced" @click="resetFilters()">
          أعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة التشكيلات</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="spinner-wrapper">
        <div class="spinner"></div>
      </div>
      <div v-else class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم التشكيل</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(f, i) in list" :key="f.id">
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>{{ f.name }}</td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(f)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 
                        2.5-4.1 5.7-4.6 9.1l-12 84c-1.1 7.5 
                        5.3 13.9 12.8 12.8l84-12c3.4-.5 
                        6.6-2.1 9.1-4.6l197.5-197.5-89.3-89.3z 
                        M497.9 56.69l-42.6-42.6c-18.7-18.7
                        -49.1-18.7-67.9 0l-39.1 39.1 89.3 89.3 
                        39.1-39.1c18.8-18.7 18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <!-- حذف -->
                    <button class="button" @click="remove(f.id)">
                      <svg viewBox="0 0 448 512" class="svgIcon">
                        <path
                          d="M135.2 17.7L128 32H32C14.3 32 0 
                        46.3 0 64s14.3 32 32 32h384c17.7 
                        0 32-14.3 32-32s-14.3-32-32-32H320
                        l-7.2-14.3C307.4 6.8 296.3 0 284.2 
                        0H163.8c-12.1 0-23.2 6.8-28.6 
                        17.7zM416 128H32l21.2 339c1.6 
                        25.3 22.6 45 47.9 45h246c25.3 0 
                        46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="3" class="py-4 text-muted">
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
  <nav class="circle-pagination d-flex justify-content-center mt-4">
    <button
      class="page-btn"
      :disabled="page === 1"
      @click="changePage(page - 1)"
    >
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

    <button
      class="page-btn"
      :disabled="page === totalPages"
      @click="changePage(page + 1)"
    >
      <i class="bi bi-chevron-left"></i>
    </button>
  </nav>

  <!-- Modal -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل تشكيل" : "إضافة تشكيل" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <label class="form-label">اسم التشكيل</label>
            <input v-model="form.name" class="form-control" required />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close()">
              إلغاء
            </button>
            <button class="btn btn-add">
              {{ editMode ? "حفظ التعديل" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
import {
  getFormations,
  addFormation,
  updateFormation,
  deleteFormation,
} from "@/services/formations.service.js";

const list = ref([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const filters = reactive({
  name: "",
});

const modalEl = ref(null);
let modal = null;
const editMode = ref(false);

const form = reactive({
  id: "",
  name: "",
});

// Load
const load = async () => {
  loading.value = true;
  try {
    const res = await getFormations({
      pageNumber: page.value,
      pageSize,
      name: filters.name || null,
    });

    list.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages;
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.name = "";
  load();
};

// Pagination
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

// Actions
const openAdd = () => {
  editMode.value = false;
  form.id = "";
  form.name = "";
  modal.show();
};

const openEdit = (item) => {
  editMode.value = true;
  form.id = item.id;
  form.name = item.name;
  modal.show();
};


const save = async () => {
  try {
    const payload = {
      name: form.name
    };
    if (editMode.value) {
      await updateFormation(form.id, payload);
      successAlert("تم تعديل التشكيل بنجاح");
    } 
    else {
      await addFormation(payload);
      successAlert("تمت إضافة التشكيل بنجاح");
    }

    modal.hide();
    load();
  } catch (error) {
    console.error("SAVE ERROR:", error);
    errorAlert("حدث خطأ أثناء الحفظ");
  }
};


const remove = async (id) => {
  const result = await confirmDelete();
  if (!result.isConfirmed) return;

  try {
    await deleteFormation(id);
    successAlert("تم الحذف بنجاح");
    load();
  } catch (e) {
    errorAlert("فشل الحذف");
  }
};


const resetForm = () => {
  form.id = "";
  form.name = "";
};

const close = () => modal.hide();

onMounted(() => {
  modal = new Modal(modalEl.value);
  load();
});
</script>
