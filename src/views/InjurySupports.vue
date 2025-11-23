<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-shield-plus"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">تأييد الإصابة</h2>
        <small class="text-muted">إدارة وتسجيل تأييدات الإصابة</small>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button type="button" class="btn btn-primary" @click="openAdd()">
        إضافة تأييد جديد
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <!-- البحث الرئيسي -->
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث باسم الجريح..."
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

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">البحث المتقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">نوع الإصابة</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.injuryType"
                  :options="injuryTypeOptions"
                  label="label"
                  :reduce="(o) => o.value"
                  searchable
                  placeholder="اختر نوع الإصابة..."
                  class="form-control p-0"
                />
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label">نوع الإصابة</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="form.injuryType"
                  :options="injuryTypeOptions"
                  label="label"
                  :reduce="(o) => o.value"
                  searchable
                  placeholder="اختر نوع الإصابة..."
                  class="form-control p-0"
                />
              </div>
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
              <label class="form-label">من تاريخ الحادث</label>
              <input
                v-model="filters.incidentDateFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ الحادث</label>
              <input
                v-model="filters.incidentDateTo"
                type="date"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-primary" @click="applyAdvanced()">بحث</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة تأييدات الإصابة</h5>
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
                <th>اسم الأم</th>
                <th>نوع الإصابة</th>
                <th>حالة الإصابة</th>
                <th>رقم الكتاب</th>
                <th>تاريخ الحادث</th>
                <th>التشكيل</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, idx) in list" :key="item.id">
                <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
                <td>{{ item.injuredName }}</td>
                <td>{{ item.motherName }}</td>
                <td>{{ injuryTypeText(item.injuryType) }}</td>
                <td>{{ injuryStatusText(item.status) }}</td>
                <td>{{ item.bookNumber }}</td>
                <td>{{ formatDateTime(item.accidentDate) }}</td>
                <td>{{ item.formationName || item.formationId }}</td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(item)">
                      <svg viewBox="0 0 512 512" class="svgIcon">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 2.5-4.1 5.7-4.6 9.1l-12 84c-1.1 7.5 
                              5.3 13.9 12.8 12.8l84-12c3.4-.5 6.6-2.1 9.1-4.6l197.5-197.5-89.3-89.3z
                              M497.9 56.69l-42.6-42.6c-18.7-18.7-49.1-18.7-67.9 0l-39.1 39.1 
                              89.3 89.3 39.1-39.1c18.8-18.7 18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <!-- حذف -->
                    <button class="button" @click="remove(item.id)">
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

              <tr v-if="list.length === 0">
                <td colspan="9" class="py-5 text-muted">
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
            {{ editMode ? "تعديل تأييد" : "إضافة تأييد" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">اسم الجريح</label>
                <input
                  v-model="form.injuredName"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">اسم الأم</label>
                <input
                  v-model="form.motherName"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">تاريخ الولادة</label>
                <input
                  v-model="form.birthDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">رقم الهاتف</label>
                <input v-model="form.phoneNumber" class="form-control" />
              </div>

              <div class="col-md-4">
                <label class="form-label">نوع الإصابة</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.injuryType"
                    :options="injuryTypeOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    searchable
                    placeholder="اختر نوع الإصابة..."
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">حالة الإصابة</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.status"
                    :options="injuryStatusOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    searchable
                    placeholder="اختر الحالة..."
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الكتاب</label>
                <input
                  v-model="form.bookNumber"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الحادث</label>
                <input
                  v-model="form.accidentDate"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">مكان الحادث</label>
                <input v-model="form.accidentPlace" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">مكان الإصابة</label>
                <input v-model="form.injuryPlace" class="form-control" />
              </div>

              <div class="col-md-3">
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

              <div class="col-md-3">
                <label class="form-label">سنة الإصابة</label>
                <input
                  v-model="form.year"
                  type="number"
                  min="1900"
                  class="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" type="button" @click="close()">
              إلغاء
            </button>
            <button class="btn btn-add" type="submit">
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
import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";
import {
  getInjurySupports,
  addInjurySupport,
  updateInjurySupport,
  deleteInjurySupport,
} from "@/services/injury-supports.service.js";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
import { getFormations } from "@/services/formations.service.js";

// ---------- Enums ----------
const injuryTypeOptions = [
  { value: 0, label: "حكومي" },
  { value: 1, label: "ميداني" },
  { value: 2, label: "أهلي" },
  { value: 3, label: "أخرى" },
];

const injuryStatusOptions = [
  { value: 0, label: "مريض" },
  { value: 1, label: "جريح" },
];

const injuryTypeText = (v) => {
  const found = injuryTypeOptions.find((x) => x.value === v);
  return found ? found.label : v;
};

const injuryStatusText = (v) => {
  const found = injuryStatusOptions.find((x) => x.value === v);
  return found ? found.label : v;
};

// ---------- State ----------
const list = ref([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const formations = ref([]);

const filters = reactive({
  injuredName: "",
  formationId: null,
  injuryType: null,
  status: null,
  incidentDateFrom: "",
  incidentDateTo: "",
});

// ---------- Modal ----------
const modalEl = ref(null);
let modal = null;
const editMode = ref(false);

const form = reactive({
  id: "",
  injuredName: "",
  motherName: "",
  birthDate: "",
  phoneNumber: "",
  injuryType: 0,
  bookNumber: "",
  accidentDate: "",
  accidentPlace: "",
  injuryPlace: "",
  formationId: null,
  status: 0,
  year: new Date().getFullYear(),
});

// ---------- Load Data ----------
const load = async () => {
  loading.value = true;
  try {
    const res = await getInjurySupports({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      formationId: filters.formationId || null,
      injuryType: filters.injuryType ?? null,
      status: filters.status ?? null,
      incidentDateFrom: filters.incidentDateFrom || null,
      incidentDateTo: filters.incidentDateTo || null,
    });

    list.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages || 1;
  } catch (e) {
    console.log(e);
    errorAlert("فشل في جلب البيانات");
  } finally {
    loading.value = false;
  }
};

const loadFormations = async () => {
  try {
    const res = await getFormations({
      pageNumber: 1,
      pageSize: 100,
    });

    formations.value = res.data.data;
  } catch (e) {
    console.log("فشل تحميل التشكيلات", e);
  }
};

// ---------- Pagination ----------
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

// ---------- Actions ----------
const openAdd = () => ((editMode.value = false), resetForm(), modal.show());

const openEdit = (item) => (
  (editMode.value = true),
  Object.assign(form, {
    ...item,
    // تحويل التاريخ لملائمة input[type=datetime-local]/[date]
    birthDate: item.birthDate ? item.birthDate.substring(0, 10) : "",
    accidentDate: item.accidentDate ? item.accidentDate.substring(0, 16) : "",
  }),
  modal.show()
);

const save = async () => {
  try {
    if (!editMode.value) {
      const res = await addInjurySupport(form);
      successAlert(res.data.message || "تمت الإضافة بنجاح");
    } else {
      const res = await updateInjurySupport(form.id, form);
      successAlert(res.data.message || "تم التعديل بنجاح");
    }

    modal.hide();
    load();
  } catch (e) {
    console.log(e);
    errorAlert("فشل في الحفظ");
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (!result.isConfirmed) return;

  try {
    const res = await deleteInjurySupport(id);
    successAlert(res.data.message || "تم الحذف بنجاح");
    load();
  } catch (e) {
    console.log(e);
    errorAlert("فشل في الحذف");
  }
};

const resetForm = () => {
  form.id = "";
  form.injuredName = "";
  form.motherName = "";
  form.birthDate = "";
  form.phoneNumber = "";
  form.injuryType = 0;
  form.bookNumber = "";
  form.accidentDate = "";
  form.accidentPlace = "";
  form.injuryPlace = "";
  form.formationId = null;
  form.status = 0;
  form.year = new Date().getFullYear();
};

const resetFilters = () => {
  filters.injuredName = "";
  filters.formationId = null;
  filters.injuryType = null;
  filters.status = null;
  filters.incidentDateFrom = "";
  filters.incidentDateTo = "";
  page.value = 1;
  load();
};

const advModalEl = ref(null);
let advModal = null;

const openAdvanced = () => advModal.show();
const closeAdvanced = () => advModal.hide();

const applyAdvanced = () => {
  advModal.hide();
  load();
};

onMounted(() => {
  advModal = new Modal(advModalEl.value);
});

const close = () => modal.hide();

const formatDateTime = (d) =>
  d
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(d))
    : "";

// ---------- init ----------
onMounted(() => {
  modal = new Modal(modalEl.value);
  load();
  loadFormations();
});
</script>
