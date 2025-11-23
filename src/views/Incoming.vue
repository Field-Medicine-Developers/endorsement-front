<template>
  <!-- Top App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-inbox"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">سجل الوارد</h2>
        <small class="text-muted">عرض وإدارة معاملات الوارد</small>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button type="button" class="btn btn-primary" @click="openAdd()">
        إضافة وارد جديد
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث بالاسم..."
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load()">بحث</button>
        <button class="btn-advanced" @click="openAdvanced()">بحث متقدم</button>
        <button class="btn-advanced" @click="resetFilters()">
          أعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الوارد</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border"></div>
      </div>

      <div v-else class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الجريح</th>
                <th>التشكيل</th>
                <th>رقم الكتاب</th>
                <th>تاريخ الوارد</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(inc, idx) in incomingList" :key="inc.id">
                <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
                <td>{{ inc.injuredName }}</td>
                <td>{{ inc.formationName }}</td>
                <td>{{ inc.incomingBookNumber }}</td>
                <td>{{ formatDate(inc.incomingDate) }}</td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(inc)">
                      <svg viewBox="0 0 512 512" class="svgIcon">
                        <path
                          d="M362.7 19.3c25-25 65.5-25
                          90.5 0l39.5 39.5c25 25 25
                          65.5 0 90.5l-39.5 39.5L323.2
                          58.8l39.5-39.5zm-68 68L58.8
                          323.2 19.3 482.7c-2.9 12.1
                          8.2 23.2 20.3 20.3l159.5-39.5L444.7
                          217.3 294.7 87.3z"
                        />
                      </svg>
                    </button>

                    <!-- حذف -->
                    <button class="button" @click="remove(inc.id)">
                      <svg viewBox="0 0 448 512" class="svgIcon">
                        <path
                          d="M135.2 17.7L128 32H32C14.3
                           32 0 46.3 0 64s14.3 32 
                           32 32h384c17.7 0 32-14.3 
                           32-32s-14.3-32-32-32H320l-7.2-14.3C307.4
                           6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2
                           6.8-28.6 17.7zM416 
                           128H32l21.2 339c1.6 25.3 
                           22.6 45 47.9 45h246c25.3 
                           0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="incomingList.length === 0">
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

  <nav class="circle-pagination d-flex justify-content-center mt-4">
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

  <!-- Modal (Add/Edit) -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل وارد" : "إضافة وارد" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label">اسم الجريح</label>
                <input
                  v-model="form.injuredName"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">التشكيل</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.formationId"
                    :options="formations"
                    label="name"
                    :reduce="(f) => f.id"
                    searchable
                    placeholder="اختر التشكيل..."
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الكتاب</label>
                <input
                  v-model="form.incomingBookNumber"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الوارد</label>
                <input
                  v-model="form.incomingDate"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-6">
                <label class="form-label">الموضوع</label>
                <input v-model="form.subject" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">الشعبة</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    searchable
                    placeholder="اختر الشعبة أو اكتب للبحث..."
                  />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label">المحتوى</label>
                <textarea
                  v-model="form.content"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" @click="close()">إلغاء</button>
            <button class="btn btn-add">
              {{ editMode ? "حفظ التعديل" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advancedModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">الموضوع</label>
              <input v-model="filters.subject" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">التشكيل</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.formationId"
                  :options="formations"
                  label="name"
                  :reduce="(f) => f.id"
                  searchable
                  placeholder="اختر التشكيل..."
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">المصدر</label>
              <input v-model="filters.source" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">من تاريخ الوارد</label>
              <input
                v-model="filters.incomingDateFrom"
                type="date"
                class="form-control"
              />
            </div>

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
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">تطبيق</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";
import { computed } from "vue";
import VueSelect from "vue3-select";
import { getDepartments } from "@/services/departments.service.js";
import { getFormations } from "@/services/formations.service.js";

import {
  getIncomings,
  addIncoming,
  updateIncoming,
  deleteIncoming,
} from "@/services/incoming.service.js";

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

const formations = ref([]);
const incomingList = ref([]);
const loading = ref(false);

// pagination
const page = ref(1);
const totalPages = ref(1);
const pageSize = 10;

// Filters
const filters = reactive({
  injuredName: "",
  subject: "",
});

// Modal
const modalEl = ref(null);
let modal = null;
const editMode = ref(false);
const departments = ref([]);

const form = reactive({
  id: "",
  injuredName: "",
  formationId: null,
  incomingBookNumber: "",
  incomingDate: "",
  subject: "",
  content: "",
  departmentId: null,
});

const resetFilters = () => {
  filters.name = "";
  filters.id = "";
  filters.injuredName = "";
  filters.formationId = null;
  filters.formationName = "";
  filters.subject = "";
  filters.content = "";
  filters.incomingDate = "";
  filters.incomingBookNumber = "";
  filters.source = "";
  load();
};

// Load data
const load = async () => {
  loading.value = true;

  try {
    const res = await getIncomings({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      subject: filters.subject || null,
      formationId: filters.formationId || null,
      source: filters.source || null,
      incomingDateFrom: filters.incomingDateFrom || null,
      incomingDateTo: filters.incomingDateTo || null,
      createdByUserId: filters.createdByUserId || null,
    });

    incomingList.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages;
  } finally {
    loading.value = false;
  }
};

const advancedModal = ref(null);
let modalAdv = null;

const openAdvanced = () => modalAdv.show();
const closeAdvanced = () => modalAdv.hide();

const applyAdvanced = () => {
  modalAdv.hide();
  page.value = 1;
  load();
};

const loadDepartments = async () => {
  try {
    const res = await getDepartments({
      pageNumber: 1,
      pageSize: 100,
    });
    departments.value = res.data.data;
  } catch {
    console.log("فشل تحميل الأقسام");
  }
};

const loadFormations = async () => {
  try {
    const res = await getFormations({
      pageNumber: 1,
      pageSize: 200,
    });
    formations.value = res.data.data;
  } catch (e) {
    console.log("فشل تحميل التشكيلات");
    formations.value = [];
  }
};

// Open Add
const openAdd = () => ((editMode.value = false), reset(), modal.show());

// Open Edit
const openEdit = (item) => (
  (editMode.value = true), Object.assign(form, item), modal.show()
);

// Save Add/Edit
const save = async () => {
  try {
    let res;

    if (!editMode.value) {
      res = await addIncoming(form);
    } else {
      res = await updateIncoming(form.id, form);
    }

    // أغلق المودل
    modal.hide();

    // أعد تحميل البيانات
    load();

    // نحصل على ID الوارد الجديد
    const incomingId = res.data.data.id;

    // نحصل على ID القسم المختار
    const deptId = form.departmentId;

    // الانتقال تلقائياً إلى صفحة الهامش
    router.push(`/ManagerNote?incomingId=${incomingId}&departmentId=${deptId}`);
  } catch (e) {
    console.log("خطأ بالحفظ", e);
  }
};

// Delete
const remove = async (id) => {
  await deleteIncoming(id);
  load();
};

// Pagination
const changePage = (p) => ((page.value = p), load());

// Reset Modal
const reset = () => {
  form.id = "";
  form.injuredName = "";
  form.formationId = null;
  form.formationName = "";
  form.subject = "";
  form.content = "";
  form.incomingDate = "";
  form.incomingBookNumber = "";
};

const close = () => modal.hide();

const formatDate = (d) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(d));

onMounted(() => {
  modal = new Modal(modalEl.value);
  modalAdv = new Modal(advancedModal.value);
  load();
  loadDepartments();
  loadFormations();
});
</script>
