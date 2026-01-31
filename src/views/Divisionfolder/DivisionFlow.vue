<template>
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-file-earmark-text"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">ملاحظات الأقسام – الشعبة</h2>
        <small class="text-muted">عرض وإدارة ملاحظات الشعبة وتحويلها</small>
      </div>
    </div>
    <!-- Bulk Transfer Button -->
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-primary"
        :disabled="selectedDepartmentIds.length === 0"
        @click="openBulkTransfer"
      >
        ترحيل المحدد ({{ selectedDepartmentIds.length }})
      </button>
    </div>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث عن اسم الجريح..."
          @keyup.enter="load"
        />
      </div>

      <!-- <div class="col-md-4">
        <input
          v-model="filters.managerNote"
          class="form-control"
          placeholder="بحث بالهامش..."
        />
      </div> -->

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load">بحث</button>
        <button class="btn-advanced" @click="openAdvancedSearchModal">
          بحث متقدم
        </button>
        <button class="btn-advanced" @click="reset">إعادة تعيين</button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="fw-bold mb-0">قائمة الملاحظات</h5>
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
                <th>
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                    />
                    <span></span>
                  </label>
                </th>
                <th>#</th>
                <th>اسم الجريح</th>
                <th>موضوع الوارد</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>عدد الكتاب</th>
                <th>هامش مدير القسم</th>
                <th>الموضوع</th>
                <th>المحتوى</th>
                <th>هامش مسوؤل الشعبة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in list" :key="item.id">
                <td>
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      :value="item.id"
                      v-model="selectedDepartmentIds"
                    />
                    <span></span>
                  </label>
                </td>
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>
                  <div v-if="item.injuredNames?.length">
                    <div
                      v-for="(name, i) in item.injuredNames.slice(0, 3)"
                      :key="i"
                    >
                      • {{ name }}
                    </div>

                    <div
                      v-if="item.injuredNames.length > 3"
                      class="show-more"
                      @click="openNamesModal(item.injuredNames)"
                    >
                      عرض الكل ({{ item.injuredNames.length }})
                    </div>
                  </div>

                  <span v-else class="text-muted">—</span>
                </td>

                <td>{{ item.subject || "-" }}</td>
                <td>{{ item.incomingBookNumber }}</td>
                <td>{{ formatDate(item.incomingDate) }}</td>
                <td>{{ item.bookCount ?? "-" }}</td>
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="
                      openManagerNotes(item.marginNote?.managerNotes || [])
                    "
                  >
                    عرض الهوامش ({{
                      item.marginNote?.managerNotes?.length || 0
                    }})
                  </button>
                </td>

                <!-- الموضوع -->
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openTextModal('الموضوع', item.subject)"
                  >
                    عرض الموضوع ({{ item.subject ? 1 : 0 }})
                  </button>
                </td>

                <!-- المحتوى -->
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openTextModal('المحتوى', item.content)"
                  >
                    عرض المحتوى ({{ item.content ? 1 : 0 }})
                  </button>
                </td>

                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openDivisionNote(item.marginNoteDivision)"
                  >
                    عرض الهامش الشعبة ({{ item.marginNoteDivision ? 1 : 0 }})
                  </button>
                </td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="button-add"
                      @click="openAdd(item.incomingId)"
                    >
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M432 256c0 17.7-14.3 32-32 32h-128v128c0 17.7-14.3 32-32 
                          32s-32-14.3-32-32V288H80c-17.7 0-32-14.3-32-32s14.3-32 
                          32-32h128V96c0-17.7 14.3-32 32-32s32 14.3 
                          32 32v128h128c17.7 0 32 14.3 32 32z"
                        />
                      </svg>
                    </button>
                    <button class="button-edit" @click="openEdit(item)">
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
                    <button class="button-reject" @click="removeItem(item.id)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
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
                    <button class="button-transfer" @click="openTransfer(item)">
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
                <td colspan="9" class="text-muted py-4">
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
  <!-- ADD/EDIT Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="save">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editMode ? "تعديل" : "إضافة" }} هامش شعبة
            </h5>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">هامش الشعبة</label>
                <input
                  class="form-control"
                  v-model="form.marginNoteDivision"
                  required
                />
              </div>
              <!-- <div class="col-md-12">
                <label class="form-label">القسم</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    placeholder="اختر القسم..."
                    :clearable="false"
                  />
                </div>
              </div> -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :disabled="isSaving"
              :class="{ 'btn-saving': isSaving }"
              @click.prevent="save"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSaving ? "جارٍ الحفظ..." : editMode ? "حفظ" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- TRANSFER Modal -->
  <div class="modal fade" tabindex="-1" ref="transferModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="transfer">
          <div class="modal-header">
            <h5 class="modal-title">تحويل هامش الشعبة</h5>
          </div>

          <div class="modal-body">
            <label class="form-label">القسم</label>
            <div class="custom-vue-select-container">
              <VueSelect
                v-model="transferForm.departmentId"
                :options="departments"
                label="name"
                :reduce="(d) => d.id"
                placeholder="اختر القسم..."
                :clearable="false"
              />
            </div>

            <label class="mt-3">ملاحظات</label>
            <textarea
              class="form-control"
              v-model="transferForm.notes"
              rows="3"
            ></textarea>

            <!-- <label class="mt-3">المرفقات</label>
            <input
              type="file"
              multiple
              class="form-control"
              @change="handleFileUpload"
            /> -->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeTransfer">
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :class="{ 'btn-saving': isTransferring }"
              :disabled="isTransferring"
            >
              <span
                v-if="isTransferring"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ isTransferring ? "جارٍ التحويل..." : "تحويل" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- BULK TRANSFER Modal -->
  <div class="modal fade" tabindex="-1" ref="bulkTransferModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="bulkTransferFunc">
          <div class="modal-header">
            <h5 class="modal-title">ترحيل المحدد إلى قسم</h5>
          </div>

          <div class="modal-body">
            <label class="form-label">القسم</label>
            <div class="custom-vue-select-container">
              <VueSelect
                v-model="bulkTransfer.departmentId"
                :options="departments"
                label="name"
                :reduce="(d) => d.id"
                placeholder="اختر القسم..."
                :clearable="false"
              />
            </div>

            <label class="mt-3">ملاحظات</label>
            <textarea
              class="form-control"
              v-model="bulkTransfer.notes"
              rows="3"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="closeBulkTransfer"
            >
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :class="{ 'btn-saving': isBulkTransferring }"
              :disabled="isBulkTransferring"
            >
              <span
                v-if="isBulkTransferring"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ isBulkTransferring ? "جارٍ الترحيل..." : "ترحيل" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Names Modal -->
  <div class="modal fade" tabindex="-1" ref="namesModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">أسماء الجرحى</h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(name, i) in allNames"
            :key="i"
            class="border-bottom py-1"
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

  <!-- Names ManagerNotes -->
  <div class="modal fade" tabindex="-1" ref="managerNotesModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">هوامش مدير القسم</h5>
        </div>

        <div class="modal-body">
          <div v-if="selectedManagerNotes.length">
            <div
              v-for="(n, i) in selectedManagerNotes"
              :key="n.id || i"
              class="border-bottom py-3"
            >
              <div class="fw-bold mb-1">{{ i + 1 }}. هامش مدير القسم</div>

              <div class="text-muted small mb-2">
                {{ formatDate(n.noteDate) }}
              </div>

              <div class="note-box">
                {{ n.managerNote }}
              </div>
            </div>
          </div>

          <p v-else class="text-muted text-center">لا توجد هوامش</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeManagerNotes">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Division Note Modal -->
  <div class="modal fade" tabindex="-1" ref="divisionNoteModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">هامش مسؤول الشعبة</h5>
        </div>

        <div class="modal-body">
          <div v-if="divisionNote" class="note-box">
            {{ divisionNote }}
          </div>

          <p v-else class="text-muted text-center">لا يوجد هامش</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeDivisionNote">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div class="modal fade" tabindex="-1" ref="advancedSearchModal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- بحث بالهامش -->
            <div class="col-md-6">
              <label class="form-label"> بالهامش</label>
              <input
                v-model="filters.managerNote"
                class="form-control"
                placeholder="بحث بالهامش..."
              />
            </div>

            <!-- عدد الكتاب -->
            <div class="col-md-6">
              <label class="form-label">عدد الكتاب</label>
              <input
                v-model.number="filters.bookCount"
                type="number"
                class="form-control"
                placeholder="عدد الكتاب..."
              />
            </div>

            <!-- من تاريخ -->
            <div class="col-md-6">
              <label class="form-label">من تاريخ</label>
              <input
                v-model="filters.createdAtFrom"
                type="date"
                class="form-control"
              />
            </div>

            <!-- إلى تاريخ -->
            <div class="col-md-6">
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
          <button
            type="button"
            class="btn btn-light"
            @click="closeAdvancedSearchModal"
          >
            إغلاق
          </button>

          <button
            type="button"
            class="btn btn-primary"
            @click="
              page = 1;
              load();
              closeAdvancedSearchModal();
            "
          >
            بحث
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Text Modal -->
  <div class="modal fade" tabindex="-1" ref="textModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">
            {{ textModal.title }}
          </h5>
        </div>

        <div class="modal-body">
          <div v-if="textModal.value" class="note-box">
            {{ textModal.value }}
          </div>

          <p v-else class="text-muted text-center">لا توجد بيانات</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeTextModal">إغلاق</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import {
  getMarginNotesDivision,
  addMarginNoteDivision,
  updateMarginNoteDivision,
  deleteMarginNoteDivision,
  transferMarginNoteDivision,
} from "@/services/margin-notes-division.service.js";
import { getDepartments } from "@/services/departments.service.js";
import { Modal } from "bootstrap";
import VueSelect from "vue3-select";
import {
  successAlert,
  errorAlert,
  confirmDelete,
  confirmAction,
} from "@/utils/alert.js";
/* ---------------- State ------------------ */
const loading = ref(false);
const list = ref([]);
const departments = ref([]);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const filters = reactive({
  injuredName: "",
  managerNote: "",
  bookCount: null,
  createdAtFrom: "",
  createdAtTo: "",
});

// Advanced search
const advancedSearchModal = ref(null);
let advancedSearchModalInstance = null;

// Add state for bulk selection
const selectedDepartmentIds = ref([]);
const selectAll = ref(false);

/* ---------------- Load Data ------------------ */
const load = async () => {
  loading.value = true;
  try {
    const res = await getMarginNotesDivision({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      managerNote: filters.managerNote || null,
      bookCount: filters.bookCount || null,
      createdAtFrom: filters.createdAtFrom || null,
      createdAtTo: filters.createdAtTo || null,
    });
    list.value = res.data.data ?? [];
    totalPages.value = res.data.pagination?.totalPages ?? 1;
    // Reset selections when data is reloaded
    selectedDepartmentIds.value = [];
    selectAll.value = false;
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  filters.injuredName = "";
  filters.managerNote = "";
  filters.bookCount = null;
  filters.id = "";
  filters.createdAtFrom = "";
  filters.createdAtTo = "";
  selectedDepartmentIds.value = [];
  selectAll.value = false;
  load();
};

/* ---------------- Select All Toggle ------------------ */
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedDepartmentIds.value = list.value.map((item) => item.id);
  } else {
    selectedDepartmentIds.value = [];
  }
};

/* ---------------- Delete ------------------ */
const removeItem = async (id) => {
  const result = await confirmDelete();
  if (!result.isConfirmed) return;
  try {
    await deleteMarginNoteDivision(id);
    successAlert("تم حذف العنصر بنجاح");
    await load();
  } catch (e) {
    errorAlert("فشل حذف العنصر");
    console.error(e);
  }
};

/* ---------------- Add/Edit Modal ------------------ */
const modalEl = ref(null);
const transferModalEl = ref(null);
const bulkTransferModalEl = ref(null);
let modal = null;
let transferModal = null;
let bulkTransferModal = null;

const editMode = ref(false);

const form = reactive({
  id: "",
  incomingId: "",
  marginNoteDivision: "",
  departmentId: "",
});

const openAdd = (incomingId) => {
  editMode.value = false;
  form.id = "";
  form.incomingId = incomingId;
  form.marginNoteDivision = "";
  form.departmentId = "";
  modal.show();
};

const openEdit = (item) => {
  editMode.value = true;
  form.id = item.id;
  form.incomingId = item.incomingId;
  form.marginNoteDivision = item.marginNoteDivision;
  form.departmentId = "";
  modal.show();
};

const isSaving = ref(false);

const save = async () => {
  if (isSaving.value) return;

  const payload = {
    incomingId: form.incomingId,
    marginNoteDivision: form.marginNoteDivision,
    departmentIds: [form.departmentId],
  };

  isSaving.value = true;

  try {
    if (editMode.value) {
      await updateMarginNoteDivision(form.id, payload);
      successAlert("تم التعديل بنجاح");
    } else {
      await addMarginNoteDivision(payload);
      successAlert("تمت الإضافة بنجاح");
    }

    modal.hide();
    load();
  } catch (e) {
    console.error("خطأ أثناء الحفظ", e);
    errorAlert("فشل الحفظ");
  } finally {
    isSaving.value = false;
  }
};

/* ---------------- Transfer ------------------ */
const transferForm = reactive({
  id: "",
  departmentId: "",
  notes: "",
  files: [],
});

const openTransfer = (item) => {
  transferForm.id = item.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferForm.files = [];
  transferModal.show();
};

const handleFileUpload = (e) => {
  transferForm.files = Array.from(e.target.files);
};

const isTransferring = ref(false);
const transfer = async () => {
  if (isTransferring.value) return;

  if (!transferForm.id || !transferForm.departmentId) {
    errorAlert("يرجى اختيار القسم");
    return;
  }
  isTransferring.value = true;
  try {
    const fd = new FormData();
    fd.append("MarginNoteDivisionId", transferForm.id);
    fd.append("DepartmentId", transferForm.departmentId);
    fd.append("Notes", transferForm.notes || "");
    if (transferForm.files?.length) {
      transferForm.files.forEach((f) => fd.append("files", f));
    }
    await transferMarginNoteDivision(fd);
    successAlert("تم التحويل بنجاح");
    transferModal.hide();
    load();
  } catch (e) {
    const serverMessage = e?.response?.data?.message || "حدث خطأ أثناء التحويل";
    transferModal.hide();
    errorAlert(serverMessage);
  } finally {
    isTransferring.value = false;
  }
};

/* ---------------- Bulk Transfer ------------------ */
const bulkTransfer = reactive({
  departmentId: null,
  notes: "",
});

const isBulkTransferring = ref(false);

const openBulkTransfer = async () => {
  if (selectedDepartmentIds.value.length === 0) {
    errorAlert("لم يتم تحديد أي عناصر");
    return;
  }

  const confirm = await confirmAction(
    "تأكيد الترحيل",
    `هل تريد ترحيل (${selectedDepartmentIds.value.length}) عناصر إلى القسم المحدد؟`
  );

  if (!confirm.isConfirmed) return;

  bulkTransfer.departmentId = null;
  bulkTransfer.notes = "";
  bulkTransferModal.show();
};

const bulkTransferFunc = async () => {
  if (isBulkTransferring.value) return;

  if (!bulkTransfer.departmentId) {
    errorAlert("يرجى اختيار القسم");
    return;
  }

  isBulkTransferring.value = true;

  try {
    // Process each selected item individually using the existing transfer function
    const successfulTransfers = [];
    const failedTransfers = [];

    for (const noteId of selectedDepartmentIds.value) {
      try {
        const fd = new FormData();
        fd.append("MarginNoteDivisionId", noteId);
        fd.append("DepartmentId", bulkTransfer.departmentId);
        fd.append("Notes", bulkTransfer.notes || "");

        await transferMarginNoteDivision(fd);
        successfulTransfers.push(noteId);
      } catch (error) {
        console.error(
          `Error transferring margin note division ${noteId}:`,
          error
        );
        failedTransfers.push({ id: noteId, error: error.message });
      }
    }

    if (failedTransfers.length > 0) {
      console.warn(
        `Successfully transferred ${successfulTransfers.length} items, ${failedTransfers.length} failed`
      );
      if (successfulTransfers.length > 0) {
        successAlert(
          `تم ترحيل ${successfulTransfers.length} عناصر بنجاح مع فشل ${failedTransfers.length} عناصر`
        );
      } else {
        errorAlert(`فشل ترحيل جميع العناصر (${failedTransfers.length})`);
      }
    } else {
      successAlert("تم ترحيل العناصر المحددة بنجاح");
    }

    bulkTransferModal.hide();
    selectedDepartmentIds.value = [];
    selectAll.value = false;
    load();
  } catch (error) {
    console.error("Unexpected error in bulk transfer:", error);
    errorAlert("فشل الترحيل");
  } finally {
    isBulkTransferring.value = false;
  }
};

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 3;

  let start = page.value - 1;
  if (start < 1) start = 1;

  let end = start + maxVisible - 1;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  load();
};

const close = () => modal.hide();
const closeTransfer = () => transferModal.hide();
const closeBulkTransfer = () => {
  bulkTransfer.departmentId = null;
  bulkTransfer.notes = "";
  bulkTransferModal.hide();
};
const closeNamesModal = () => {
  if (!namesModalInstance) return;
  namesModalInstance.hide();
};

/* ---------------- Helpers ------------------ */
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
};

const allNames = ref([]);
const namesModal = ref(null);
let namesModalInstance = null;

const openNamesModal = (names) => {
  allNames.value = names;
  namesModalInstance.show();
};

const selectedManagerNotes = ref([]);
const managerNotesModalEl = ref(null);
let managerNotesModal = null;
const openManagerNotes = (notes) => {
  selectedManagerNotes.value = notes || [];
  managerNotesModal.show();
};

const closeManagerNotes = () => {
  managerNotesModal.hide();
};

const openAdvancedSearchModal = () => {
  advancedSearchModalInstance.show();
};

const closeAdvancedSearchModal = () => {
  advancedSearchModalInstance.hide();
};

/* -------- Division Note Modal -------- */
const divisionNoteModalEl = ref(null);
let divisionNoteModal = null;

const divisionNote = ref("");

const openDivisionNote = (note) => {
  divisionNote.value = note || "";
  divisionNoteModal.show();
};

const closeDivisionNote = () => {
  divisionNoteModal.hide();
};

// ===============================
// Text Modal
// ===============================

const textModalEl = ref(null);
let textModalInstance = null;

const textModal = reactive({
  title: "",
  value: "",
});

const openTextModal = (title, value) => {
  textModal.title = title;
  textModal.value = value || "";
  textModalInstance.show();
};

const closeTextModal = () => {
  textModalInstance.hide();
};

/* ---------------- Init ------------------ */
onMounted(async () => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  bulkTransferModal = new Modal(bulkTransferModalEl.value);
  managerNotesModal = new Modal(managerNotesModalEl.value);
  advancedSearchModalInstance = new Modal(advancedSearchModal.value);
  divisionNoteModal = new Modal(divisionNoteModalEl.value);
  textModalInstance = new Modal(textModalEl.value);
  await load();
  const res = await getDepartments({ pageNumber: 1, pageSize: 200 });
  departments.value = res.data.data;
  if (namesModal.value) {
    namesModalInstance = new Modal(namesModal.value);
  }
});
</script>
