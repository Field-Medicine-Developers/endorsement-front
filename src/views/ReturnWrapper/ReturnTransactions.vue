<template>
  <!-- Top App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-repeat"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">معاملات الاسترجاع</h2>
        <small class="text-muted">إدارة معاملات الاسترجاع</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="openAdd">
      إضافة معاملة الاسترجاع
    </button>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-4">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث باسم الجريح..."
        />
      </div>

      <div class="col-md-4">
        <input
          v-model="filters.bookNumber"
          class="form-control"
          placeholder="بحث برقم الكتاب..."
        />
      </div>

      <div class="col-md-4 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load">بحث</button>
        <button class="btn-advanced" @click="openAdvancedSearch">
          بحث متقدم
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة معاملات الاسترجاع</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="spinner-wrapper">
        <div class="spinner"></div>
      </div>

      <div v-else class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table text-center align-middle">
            <thead>
              <tr>
                <th>#</th>
                <!-- <th>اسم الجريح</th> -->
                <!-- <th>اللواء</th> -->
                <th>رقم الكتاب</th>
                <th>تاريخ الاسترجاع</th>
                <th>المرفقات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in list" :key="item.id">
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <!-- <td>{{ item.injuredName }}</td> -->
                <td>{{ item.formationName }}</td>
                <td>{{ item.bookNumber }}</td>
                <td>{{ formatDate(item.returnDate) }}</td>
                <td>
                  <button class="btn-view-files" @click="viewFiles(item.files)">
                    <i class="bi bi-paperclip me-1"></i>
                    عرض ({{ item.files.length }})
                  </button>
                </td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="button-edit" @click="openEdit(item)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 2.5-4.1 5.7-4.6 9.1l-12 84c-1.1 7.5 5.3 13.9 12.8 12.8l84-12c3.4-.5 6.6-2.1 9.1-4.6l197.5-197.5-89.3-89.3z M497.9 56.69l-42.6-42.6c-18.7-18.7-49.1-18.7-67.9 0l-39.1 39.1 89.3 89.3 39.1-39.1c18.8-18.7 18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <button class="button" @click="remove(item.id)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M135.2 17.7L128 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h246c25.3 0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="7" class="py-5 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد بيانات</td>
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

  <!-- Add/Edit Modal -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content glass-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل معاملة إرجاع" : "إضافة معاملة إرجاع" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">اسم الجريح</label>
                <input
                  v-model="form.injuredName"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <!-- <div class="col-md-6">
                <label class="form-label">اللواء</label>
                <select v-model="form.formationId" class="form-select" required>
                  <option value="">اختر اللواء</option>
                  <option
                    v-for="formation in formations"
                    :key="formation.id"
                    :value="formation.id"
                  >
                    {{ formation.name }}
                  </option>
                </select>
              </div> -->

              <div class="col-md-6">
                <label class="form-label">رقم الكتاب</label>
                <input
                  v-model="form.bookNumber"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">نسبة الاسترجاع</label>
                <input
                  v-model="form.returnPercentage"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">سبب الاسترجاع</label>
                <input
                  v-model="form.returnPercentage"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ المعاملة</label>
                <input
                  v-model="form.date"
                  type="datetime-local"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الاستلام</label>
                <input
                  v-model="form.receiveDate"
                  type="datetime-local"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الاسترجاع</label>
                <input
                  v-model="form.returnDate"
                  type="datetime-local"
                  class="form-control"
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">المرفقات</label>

                <!-- اختيار الملفات -->
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="form-control"
                  multiple
                />

                <!-- الملفات الجديدة -->
                <div class="attachments-box mt-3" v-if="form.files.length > 0">
                  <div class="attachments-title">
                    الملفات المحددة ({{ form.files.length }})
                  </div>

                  <div
                    v-for="(file, index) in form.files"
                    :key="index"
                    class="attachment-item"
                  >
                    <span class="file-name">{{ file.name }}</span>

                    <button
                      class="remove-file-btn"
                      type="button"
                      @click="removeSelectedFile(index)"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                <!-- الملفات الحالية (في وضع التعديل) -->
                <div
                  class="attachments-box mt-3"
                  v-if="editMode && form.existingFiles.length > 0"
                >
                  <div class="attachments-title">
                    الملفات الحالية ({{ form.existingFiles.length }})
                  </div>

                  <div
                    v-for="(file, index) in form.existingFiles"
                    :key="index"
                    class="attachment-item"
                  >
                    <span class="file-name">{{ getFileName(file) }}</span>

                    <button
                      class="remove-file-btn"
                      type="button"
                      @click="removeExistingFile(index)"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="close"
              :disabled="saving"
            >
              إلغاء
            </button>
            <button class="btn btn-add" :disabled="saving">
              <span
                v-if="saving"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              {{ editMode ? "حفظ" : "إضافة" }}
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
            <!-- <div class="col-md-6">
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div> -->

            <!-- <div class="col-md-6">
              <label class="form-label">اللواء</label>
              <select v-model="filters.formation" class="form-select">
                <option value="">الكل</option>
                <option
                  v-for="formation in formations"
                  :key="formation.id"
                  :value="formation.name"
                >
                  {{ formation.name }}
                </option>
              </select>
            </div> -->

            <div class="col-md-6">
              <label class="form-label">رقم الكتاب</label>
              <input v-model="filters.bookNumber" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">من تاريخ الاسترجاع</label>
              <input
                v-model="filters.returnDateFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ الاسترجاع</label>
              <input
                v-model="filters.returnDateTo"
                type="date"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إلغاء</button>
          <button class="btn btn-add" @click="applyAdvanced()">تطبيق</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Files Viewer Modal -->
  <div class="modal fade" ref="filesModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content attachment-modal">
        <div class="modal-header bg-light">
          <h5 class="modal-title">
            <!-- <i class="bi bi-paperclip me-2"></i> -->
            معاينة المرفقات
          </h5>
          <!-- <button type="button" class="btn-close" @click="closeFilesModal"></button> -->
        </div>
        <div class="modal-body p-0">
          <div v-if="selectedFiles.length > 0" class="files-container">
            <!-- File Navigation Tabs -->
            <ul class="nav nav-tabs" id="fileTabs" role="tablist">
              <li
                class="nav-item"
                role="presentation"
                v-for="(file, index) in selectedFiles"
                :key="index"
              >
                <button
                  class="nav-link"
                  :class="{ active: index === 0 }"
                  :id="`tab-${index}`"
                  data-bs-toggle="tab"
                  :data-bs-target="`#file-${index}`"
                  type="button"
                  role="tab"
                >
                  <!-- <i class="bi" :class="getFileIconClass(file)"></i> -->
                  ملف {{ index + 1 }}
                </button>
              </li>
            </ul>

            <!-- File Content Panes -->
            <div class="tab-content p-3" id="fileTabsContent">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="tab-pane fade"
                :class="{ 'show active': index === 0 }"
                :id="`file-${index}`"
                role="tabpanel"
              >
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <!-- <h6 class="mb-0">
                    <i class="bi" :class="getFileIconClass(file)"></i>
                    {{ getFileName(file) }}
                  </h6> -->
                  <!-- <a :href="file" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-download me-1"></i>
                    تحميل الملف
                  </a> -->
                </div>

                <div class="file-preview-container border rounded p-3 bg-light">
                  <iframe
                    v-if="isPdf(file)"
                    :src="`${file}#toolbar=0&zoom=85`"
                    class="file-iframe"
                    frameborder="0"
                  ></iframe>
                  <img
                    v-else-if="isImage(file)"
                    :src="file"
                    alt="Attachment"
                    class="file-image img-fluid"
                  />
                  <div v-else class="file-not-supported text-center p-5">
                    <i
                      class="bi bi-file-earmark-excel fs-1 text-muted mb-3"
                    ></i>
                    <h5 class="text-muted">نوع الملف غير مدعوم للمعاينة</h5>
                    <p class="text-muted">
                      يمكنك تحميل الملف لمشاهدته على جهازك
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-5">
            <i class="bi bi-paperclip fs-1 text-muted mb-3"></i>
            <p class="text-muted">لا توجد مرفقات لعرضها</p>
          </div>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-light" @click="closeFilesModal">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";

import {
  getReturnTransactions,
  addReturnTransaction,
  updateReturnTransaction,
  deleteReturnTransaction,
} from "@/services/return-transactions.service.js";

import { getFormations } from "@/services/formations.service.js";

import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const list = ref([]);
const loading = ref(false);
const saving = ref(false);

const filters = reactive({
  injuredName: "",
  bookNumber: "",
  formation: "",
  returnDateFrom: "",
  returnDateTo: "",
});

const modalEl = ref(null);
const advancedModal = ref(null);
const filesModal = ref(null);
let modal = null;
let advancedSearchModal = null;
let filesViewerModal = null;

const editMode = ref(false);

const form = reactive({
  id: "",
  injuredName: "",
  formationId: "",
  bookNumber: "",
  returnPercentage: "",
  date: "",
  receiveDate: "",
  returnDate: "",
  files: [], // New files to upload
  existingFiles: [], // Existing files for display in edit mode
});

// For file viewer
const selectedFiles = ref([]);

// Load formations for dropdowns
const formations = ref([]);

const loadFormations = async () => {
  try {
    const res = await getFormations({ pageNumber: 1, pageSize: 100 });
    formations.value = res.data.data;
  } catch (err) {
    errorAlert("فشل في جلب التشكيلات");
  }
};

const load = async () => {
  loading.value = true;

  try {
    const res = await getReturnTransactions({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      bookNumber: filters.bookNumber || null,
      formation: filters.formation || null,
      returnDateFrom: filters.returnDateFrom || null,
      returnDateTo: filters.returnDateTo || null,
    });

    list.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages;
  } catch (err) {
    errorAlert("فشل في جلب معاملات الاسترجاع");
  } finally {
    loading.value = false;
  }
};

const visiblePages = computed(() => {
  const arr = [];
  let start = page.value - 1;

  if (start < 1) start = 1;

  let end = start + 2;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - 2);
  }

  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
});

const openAdd = () => {
  editMode.value = false;
  resetForm();
  modal.show();
};

const openEdit = (item) => {
  editMode.value = true;
  resetForm();
  form.id = item.id;
  form.injuredName = item.injuredName;
  form.formationId = item.formationId;
  form.bookNumber = item.bookNumber;
  form.returnPercentage = item.returnPercentage;
  form.date = formatDateTimeForInput(item.date);
  form.receiveDate = formatDateTimeForInput(item.receiveDate);
  form.returnDate = formatDateTimeForInput(item.returnDate);
  form.existingFiles = item.files || []; // Store existing files for display
  modal.show();
};

const save = async () => {
  saving.value = true;
  try {
    const formData = new FormData();

    formData.append("InjuredName", form.injuredName);
    formData.append("FormationId", form.formationId);
    formData.append("BookNumber", form.bookNumber);
    formData.append("ReturnPercentage", form.returnPercentage);
    formData.append("Date", form.date);
    formData.append("ReceiveDate", form.receiveDate);
    formData.append("ReturnDate", form.returnDate);
    form.files.forEach((file) => {
      formData.append("Files", file);
    });

    if (!editMode.value) {
      await addReturnTransaction(formData);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateReturnTransaction(form.id, formData);
      successAlert("تم تعديل المعاملة");
    }

    modal.hide();
    load();
  } catch (err) {
    errorAlert("حدث خطأ أثناء الحفظ");
  } finally {
    saving.value = false;
  }
};

const remove = async (id) => {
  const res = await confirmDelete();
  if (!res.isConfirmed) return;

  try {
    await deleteReturnTransaction(id);
    successAlert("تم حذف المعاملة");
    load();
  } catch {
    errorAlert("فشل حذف المعاملة");
  }
};

const resetForm = () => {
  form.id = "";
  form.injuredName = "";
  form.formationId = "";
  form.bookNumber = "";
  form.returnPercentage = "";
  form.date = "";
  form.receiveDate = "";
  form.returnDate = "";
  form.files = [];
  form.existingFiles = [];
};

const handleFileUpload = (event) => {
  form.files.push(...event.target.files);
  event.target.value = "";
};

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  load();
};

const close = () => modal.hide();

// Advanced search functions
const openAdvancedSearch = () => {
  advancedSearchModal.show();
};

const applyAdvanced = () => {
  advancedSearchModal.hide();
  page.value = 1;
  load();
};

const closeAdvanced = () => {
  advancedSearchModal.hide();
};

// File viewer functions
const viewFiles = (files) => {
  selectedFiles.value = files;
  filesViewerModal.show();

  // Initialize tabs after modal is shown
  setTimeout(() => {
    const triggerTabList = [].slice.call(
      document.querySelectorAll("#fileTabs button")
    );
    triggerTabList.forEach((triggerEl) => {
      new bootstrap.Tab(triggerEl);
    });
  }, 100);
};

const closeFilesModal = () => {
  filesViewerModal.hide();
  selectedFiles.value = [];
};

// Helper functions for file types
const isPdf = (fileUrl) => {
  return fileUrl.toLowerCase().endsWith(".pdf");
};

const isImage = (fileUrl) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => fileUrl.toLowerCase().endsWith(ext));
};

const getFileIconClass = (fileUrl) => {
  if (isPdf(fileUrl)) {
    return "bi-file-pdf-fill text-danger";
  } else if (isImage(fileUrl)) {
    return "bi-file-image-fill text-success";
  } else {
    return "bi-file-earmark-fill text-primary";
  }
};

const getFileName = (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    return pathParts[pathParts.length - 1] || "ملف مرفق";
  } catch (e) {
    return "ملف مرفق";
  }
};

// Date formatting functions
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
  }).format(dt);
};

const formatDateTimeForInput = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";

  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const removeSelectedFile = (index) => {
  form.files.splice(index, 1);
};

onMounted(() => {
  modal = new Modal(modalEl.value);
  advancedSearchModal = new Modal(advancedModal.value);
  filesViewerModal = new Modal(filesModal.value);
  load();
  loadFormations();
});
</script>
