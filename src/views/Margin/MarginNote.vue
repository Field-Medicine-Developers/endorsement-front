<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-receipt"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">إضافات الهامش</h2>
        <small class="text-muted">إضافة رقم الكتاب – التاريخ – الأصل</small>
      </div>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <!-- بحث بالاسم -->
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder=" بحث بالاسم..."
          @keyup.enter="load"
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load()">بحث</button>

        <button class="btn-advanced" @click="openAdvanced()">بحث متقدم</button>

        <button class="btn-advanced" @click="resetFilters()">
          إعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الإضافات</h5>
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
                <th>تاريح استلام المعاملة</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>هامش مدير القسم</th>
                <th>هامش مسوؤل شعبة</th>
                <th>تاريخ الكتاب</th>
                <!-- <th>ملف الأصل</th> -->
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(m, i) in list" :key="m.id">
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>{{ formatDate(m.createdAt) }}</td>
                <!-- <td>
                  <div>
                    <div>{{ m.injuredNames?.[0] }}</div>
                    <div
                      v-if="m.injuredNames && m.injuredNames.length > 1"
                      class="show-more"
                      @click="openNamesModal(m.injuredNames)"
                    >
                      عرض الكل ({{ m.injuredNames.length }})
                    </div>
                  </div>
                </td> -->

                <td>{{ m.incomingBookNumber }}</td>
                <td>{{formatDate( m.incomingDate) }}</td>
                <td>{{ m.managerNote }}</td>
                <td>{{ m.managerNoteDivision || "—" }}</td>  
                <td>{{ formatDate(m.createdAt) }}</td>
                <!-- <td>
                  <span v-if="m.hasOriginalFile" class="badge bg-success"
                    >نعم</span
                  >
                  <span v-else class="badge bg-secondary">لا</span>
                </td> -->

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- زر إضافة هامش -->
                    <button class="button-add" @click="openAdd(m.incomingId)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M432 256c0 17.7-14.3 32-32 32h-128v128c0 17.7-14.3 32-32 
                          32s-32-14.3-32-32V288H80c-17.7 0-32-14.3-32-32s14.3-32 
                          32-32h128V96c0-17.7 14.3-32 32-32s32 14.3 
                          32 32v128h128c17.7 0 32 14.3 32 32z"
                        />
                      </svg>
                    </button>
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(m)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 2.5-4.1 
                          5.7-4.6 9.1l-12 84c-1.1 7.5 5.3 13.9 
                          12.8 12.8l84-12c3.4-.5 6.6-2.1 
                          9.1-4.6l197.5-197.5-89.3-89.3z 
                          M497.9 56.69l-42.6-42.6c-18.7-18.7-49.1-18.7-67.9 
                          0l-39.1 39.1 89.3 89.3 39.1-39.1c18.8-18.7 
                          18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <!-- حذف -->
                    <button class="button" @click="remove(m.id)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M135.2 17.7L128 32H32c-17.7 0-32 14.3-32 32s14.3 32 
                           32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 
                           6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 
                           128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h246c25.3 
                           0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>

                    <button class="button-transfer" @click="openTransfer(m)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M492.7 273.4L400 366.1c-15 15-41 4.5-41-17V320H208c-22.1 
                           0-40-17.9-40-40v-48c0-22.1 17.9-40 40-40h151V162c0-21.5 
                           26-32 41-17l92.7 92.7c9.4 9.4 9.4 24.6 0 
                           34.1zM20 238.6l92.7-92.7c15-15 41-4.5 41 17v42h151c22.1 
                           0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H153v29.1c0 21.5-26 
                           32-41 17L20 273.4c-9.4-9.4-9.4-24.6 0-34.1z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="8" class="py-4 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد بيانات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- </div> -->

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
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل معلومات" : "إضافة معلومات" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">هامش المدير</label>
                <input
                  v-model="form.managerNote"
                  class="form-control"
                  required
                />
              </div>

              <!-- <div class="col-md-6">
                <label class="form-label">هل يوجد ملف أصل؟</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.hasOriginalFile"
                    :options="[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]"
                    label="label"
                    :reduce="(opt) => opt.value"
                    searchable
                    placeholder="اختر الحالة..."
                  />
                </div>
              </div> -->

              <div class="col-md-6">
                <label class="form-label">إرسال إلى الوحدة:</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.departmentIds"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    multiple
                    searchable
                    placeholder="اختر الوحدة..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close()">
              إلغاء
            </button>
            <button class="btn btn-add">
              {{ editMode ? "حفظ" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Transfer Modal -->
  <div class="modal fade" tabindex="-1" ref="transferModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">تحويل إلى قسم آخر</h5>
        </div>

        <form @submit.prevent="transfer">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">القسم</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="transferForm.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    searchable
                    placeholder="اختر القسم..."
                  />
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">ملاحظات</label>
                <textarea
                  v-model="transferForm.notes"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div class="col-md-12">
                <label class="form-label">المرفقات</label>
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="form-control"
                  multiple
                />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="closeTransfer()"
            >
              إلغاء
            </button>
            <button class="btn btn-primary" :disabled="transferLoading">
              <span
                v-if="transferLoading"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              تحويل
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advancedModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- <div class="col-12">
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div> -->

            <div class="col-12">
              <label class="form-label"> هامش المدير</label>
              <input v-model="filters.managerNote" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">من تاريخ</label>
              <input
                v-model="filters.createdAtFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-12">
              <label class="form-label">إلى تاريخ</label>
              <input
                v-model="filters.createdAtTo"
                type="date"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">بحث</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Names Modal – عرض كل أسماء الجرحى -->
  <div class="modal fade" tabindex="-1" ref="namesModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">أسماء الجرحى</h5>
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
          <button class="btn btn-light" @click="closeNamesModal()">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useRoute, useRouter } from "vue-router";
import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";

import {
  getMarginNotes,
  addMarginNote,
  updateMarginNote,
  deleteMarginNote,
  transferMarginNote,
} from "@/services/margin-note.service.js";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
import { getDepartments } from "@/services/departments.service.js";

const route = useRoute();
const router = useRouter();

// Values ​​from the inbox page
const incomingId = ref(route.query.incomingId || null);
const departmentId = route.query.departmentId;

// ===== Table data =====
const list = ref([]);
const loading = ref(false);

// ===== Pagination =====
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const visiblePages = ref([1]);

// ===== Departments =====
const departments = ref([]);

// ===== Transfer Form =====
const transferForm = reactive({
  marginNoteId: "",
  departmentId: "",
  notes: "",
  files: [],
});

const transferLoading = ref(false);

// ===== Download data =====
const load = async () => {
  loading.value = true;

  try {
    const res = await getMarginNotes({
      pageNumber: page.value,
      pageSize: pageSize,
      incomingId: incomingId.value || null,
      injuredName: filters.injuredName || null,
      managerNote: filters.managerNote || null,
      createdAtFrom: filters.createdAtFrom || null,
      createdAtTo: filters.createdAtTo || null,
    });

    list.value = res.data.data.map((item) => ({
      ...item,
      injuredNames: item.injuredName
        ? item.injuredName.split(",").map((n) => n.trim())
        : [],
    }));
  } finally {
    loading.value = false;
  }
};

// ===== Download departments =====
const loadDepartments = async () => {
  try {
    const res = await getDepartments({ pageNumber: 1, pageSize: 100 });
    departments.value = res.data.data.filter(
      (dept) => dept.id !== departmentId
    );
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

// ===== modal =====
const modalEl = ref(null);
const transferModalEl = ref(null);
let modal = null;
let transferModal = null;
let advancedModal = null;
const advancedModalEl = ref(null);
const editMode = ref(false);

const form = reactive({
  id: "",
  incomingId,
  managerNote: "",
  hasOriginalFile: false,
  departmentIds: [departmentId],
});

const openAdd = (incomingIdFromRow) => {
  incomingId.value = incomingIdFromRow;
  editMode.value = false;
  form.id = "";
  form.managerNote = "";
  form.hasOriginalFile = false;
  form.departmentIds = [];
  modal.show();
};

const openEdit = (row) => {
  editMode.value = true;
  form.id = row.id;
  form.managerNote = row.managerNote;
  form.hasOriginalFile = row.hasOriginalFile;
  modal.show();
};

const save = async () => {
  if (!incomingId) {
    errorAlert("لا يمكن الإضافة —بيانات الوارد غير موجودة");
    return;
  }

  const data = {
    incomingId: incomingId.value,
    managerNote: form.managerNote,
    departmentIds: form.departmentIds,
  };

  console.log("DATA SENT:", data);

  try {
    if (!editMode.value) {
      await addMarginNote(data);
      successAlert("تمت إضافة الهامش بنجاح");
    } else {
      await updateMarginNote(form.id, data);
      successAlert("تم تحديث الهامش بنجاح");
    }

    modal.hide();
    load();
  } catch (error) {
    console.error("SERVER ERROR:", error);
    errorAlert("فشل الحفظ — تحقق من الحقول");
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await deleteMarginNote(id);
      successAlert("تم الحذف بنجاح");
      load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  }
};

const close = () => modal.hide();

// ===== Transfer Functions =====
const openTransfer = (row) => {
  transferForm.marginNoteId = row.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferForm.files = [];
  transferModal.show();
};

const handleFileUpload = (event) => {
  transferForm.files = Array.from(event.target.files);
};

const transfer = async () => {
  transferLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("MarginNoteId", transferForm.marginNoteId);
    formData.append("DepartmentId", transferForm.departmentId);
    formData.append("Notes", transferForm.notes);

    for (let i = 0; i < transferForm.files.length; i++) {
      formData.append("files", transferForm.files[i]);
    }

    await transferMarginNote(formData);
    transferModal.hide();
    load(); // Refresh the list
  } catch (error) {
    console.error("Error transferring margin note:", error);
    alert("حدث خطأ أثناء التحويل");
  } finally {
    transferLoading.value = false;
  }
};

const openAdvanced = () => {
  advancedModal.show();
};

const closeAdvanced = () => {
  advancedModal.hide();
};

const applyAdvanced = () => {
  advancedModal.hide();
  load();
};

const filters = reactive({
  injuredName: "",
  managerNote: "",
  createdAtFrom: "",
  createdAtTo: "",
});

const resetFilters = () => {
  filters.injuredName = "";
  filters.managerNote = "";
  filters.createdAtFrom = "";
  filters.createdAtTo = "";
  load();
};

const closeTransfer = () => transferModal.hide();

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

//  Modal عرض جميع أسماء الجرحى
const allNames = ref([]);
const namesModalEl = ref(null);
let namesModal = null;

const openNamesModal = (names) => {
  allNames.value = names;
  namesModal.show();
};

const closeNamesModal = () => {
  namesModal.hide();
};

// ===== INIT =====
onMounted(() => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  advancedModal = new Modal(advancedModalEl.value);
  namesModal = new Modal(namesModalEl.value);
  load();
  loadDepartments();
});
</script>
