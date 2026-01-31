<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-send"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">الصادر السري</h2>
        <small class="text-muted">إدارة معاملات الصادر السري</small>
      </div>
    </div>
    <!-- <button class="btn btn-primary" @click="openAdd">إضافة صادر جديد</button> -->
  </div>

   <!-- Search -->
   <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
  <input
    v-model="filters.exportNumber"
    class="form-control"
    placeholder="بحث عن رقم الصادر..."
    @keyup.enter="load"
  />
</div>

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
      <h5 class="mb-0 fw-bold primary">صادر شعبة الإدارة</h5>
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
                <th>رقم الصادر</th>
                <th>تاريخ الصادر</th>
                <th>الجهة المرسل إليها</th>
                <th>الموضوع</th>
                <th>المحتوى</th>
                <th v-role="[0, 3]" class="text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="item.id">
                <td>{{ (page - 1) * pageSize + index + 1 }}</td>
                <td>{{ item.exportNumber }}</td>
                <td>{{ formatDate(item.exportDate) }}</td>
                <td>{{ item.destinationDepartment }}</td>
                <td>{{ item.subject }}</td>
                <td>{{ item.content }}</td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button
                      v-role="[0, 3]"
                      class="button-edit"
                      @click="openEdit(item)"
                    >
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
                    <button
                      v-role="[0]"
                      class="button"
                      @click="remove(item.id)"
                    >
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
                    <!-- مرفقات -->
                    <button
                      v-role="[0, 3]"
                      class="button-archive"
                      title="عرض المرفقات"
                      @click="openArchive(item)"
                    >
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M424.4 214.7L253.1 386c-35.2 35.2-92.3 35.2-127.5 0
                             s-35.2-92.3 0-127.5L300.3 83.9c23.4-23.4 61.4-23.4
                             84.9 0s23.4 61.4 0 84.9L224.6 329.4c-11.7 11.7-30.7
                             11.7-42.4 0s-11.7-30.7 0-42.4L318.1 151c6.2-6.2
                             6.2-16.4 0-22.6s-16.4-6.2-22.6 0L159.6 264.3"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="list.length === 0">
                <td colspan="7" class="py-4 text-muted">
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
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            {{ isEdit ? "تعديل صادر" : "إضافة صادر جديد" }}
          </h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="row g-3">
            <!-- نوع الصادر -->
            <div class="col-12">
              <div class="typeIncoming-header">
                <label class="form-label m-0">نوع الصادر</label>

                <div class="typeIncoming-wrapper">
                  <button
                    type="button"
                    class="typeIncoming-btn"
                    :class="{ active: form.typeExport === 1 }"
                    @click="form.typeExport = 1"
                  >
                    عام
                  </button>

                  <button
                    type="button"
                    class="typeIncoming-btn"
                    :class="{ active: form.typeExport === 2 }"
                    @click="form.typeExport = 2"
                  >
                    سري
                  </button>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">رقم الصادر</label>
              <input v-model="form.exportNumber" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الصادر</label>
              <input
                type="date"
                v-model="form.exportDate"
                class="form-control"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">الجهة المرسل إليها</label>
              <input
                v-model="form.destinationDepartment"
                class="form-control"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">الموضوع</label>
              <input v-model="form.subject" class="form-control" />
            </div>

            <div class="col-md-12">
              <label class="form-label">المحتوى</label>
              <textarea
                v-model="form.content"
                rows="4"
                class="form-control"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeModal">
            إلغاء
          </button>

          <button
            class="btn btn-primary"
            :disabled="isSaving"
            @click="save"
            :class="{ 'btn-saving': isSaving }"
          >
            <span
              v-if="isSaving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديل" : "إضافة" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Modal -->
  <div class="modal fade" ref="archiveUploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
          </h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div
            v-for="(item, index) in archiveInputs"
            :key="index"
            class="d-flex gap-2 align-items-center mb-2"
          >
            <!-- Input -->
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              class="form-control"
              @change="onArchiveFilesSelected($event, index)"
            />
            <!-- حذف -->
            <button
              v-if="archiveInputs.length > 1"
              class="btn btn-outline-danger"
              @click="removeArchiveInput(index)"
              title="حذف"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button class="btn btn-search w-100 mt-3" @click="addArchiveInput">
            <i class="bi bi-plus-lg me-1"></i>
            إضافة مرفق آخر
          </button>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchiveUpload">
            إلغاء
          </button>
          <button
            class="btn btn-primary"
            :disabled="isUploadingArchive"
            @click="submitArchiveUpload"
          >
            <span
              v-if="isUploadingArchive"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            {{ isUploadingArchive ? "جارٍ الرفع..." : "رفع" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" ref="archiveModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-folder2-open me-1"></i>
            مرفقات الإدارة والبيانات
          </h5>
        </div>

        <div class="modal-body">
          <div
            v-if="archiveFiles.length === 0"
            class="text-muted text-center py-4"
          >
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            لا توجد مرفقات
          </div>

          <div v-else class="list-group">
            <button
              v-for="(file, i) in archiveFiles"
              :key="i"
              class="list-group-item list-group-item-action d-flex align-items-center gap-2"
              @click="openFile(file.fileFullUrl)"
            >
              <i class="bi bi-file-earmark-pdf text-danger fs-5"></i>
              <span class="flex-grow-1">{{ file.fileName }}</span>
              <i class="bi bi-box-arrow-up-right text-muted"></i>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchiveModal">
            إغلاق
          </button>
          <button class="btn btn-primary" @click="openArchiveUploadFromView">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
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
          <!-- رقم الصادر -->
          <div class="col-md-6">
            <label class="form-label">رقم الصادر</label>
            <input
              v-model="filters.exportNumber"
              class="form-control"
              placeholder="أدخل رقم الصادر..."
            />
          </div>

          <!-- تاريخ الصادر -->
          <div class="col-md-6">
            <label class="form-label">تاريخ الصادر</label>
            <input
              v-model="filters.exportDate"
              type="date"
              class="form-control"
            />
          </div>

          <!-- الجهة المرسل إليها -->
          <div class="col-md-12">
            <label class="form-label">الجهة المرسل إليها</label>
            <input
              v-model="filters.destinationDepartment"
              class="form-control"
              placeholder="أدخل اسم الجهة..."
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-light" @click="closeAdvancedSearchModal">
          إغلاق
        </button>

        <button
          class="btn btn-primary"
          @click="applyAdvancedSearch"
        >
          بحث
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import * as bootstrap from "bootstrap";
import {
  getExportsSecret,
  createExport,
  updateExport,
  deleteExport,
  uploadExportArchive,
} from "@/services/exports.service";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";

// ========== state ==========
const list = ref([]);
const loading = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const isSaving = ref(false);

// Pagination
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

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

// Form
const form = ref({
  typeExport: 1,
  exportNumber: "",
  exportDate: "",
  destinationDepartment: "",
  subject: "",
  content: "",
});

const filters = reactive({
  exportNumber: "",
  exportDate: "",
  destinationDepartment: "",
});


// Modals
const modalEl = ref(null);
const archiveModalEl = ref(null);
const archiveUploadModal = ref(null);

let modalInstance = null;
let archiveModalInstance = null;
let archiveUploadModalInstance = null;

// Archive
const archiveFiles = ref([]);
const currentExportId = ref("");
const archiveInputs = ref([{ files: [] }]);


// ========== functions ==========
const load = async () => {
  loading.value = true;

  try {
    const res = await getExportsSecret({
  pageNumber: page.value,
  pageSize,
  exportNumber: filters.exportNumber || null,
  exportDate: filters.exportDate ? new Date(filters.exportDate).toISOString() : null,
  destinationDepartment: filters.destinationDepartment || null,
});

list.value = res.data?.data ?? [];  // ✅ هنا التعديل

totalPages.value = res.data?.pagination?.totalPages || 1;
  } catch (e) {
    console.error(e);
    errorAlert("حدث خطأ أثناء تحميل البيانات");
  } finally {
    loading.value = false;
  }
};

const advancedSearchModal = ref(null);
let advancedSearchModalInstance = null;

const openAdvancedSearchModal = () => {
  advancedSearchModalInstance.show();
};

const closeAdvancedSearchModal = () => {
  advancedSearchModalInstance.hide();
};

const applyAdvancedSearch = () => {
  page.value = 1; // يرجع لأول صفحة
  closeAdvancedSearchModal();
  load();
};

const reset = () => {
  filters.exportNumber = "";
  filters.exportDate = "";
  filters.destinationDepartment = "";
  page.value = 1;
  load();
};


const openAdd = () => {
  isEdit.value = false;
  currentId.value = null;
  resetForm();
  modalInstance.show();
};

const openEdit = (item) => {
  isEdit.value = true;
  currentId.value = item.id;
  form.value = {
    typeExport: 2,
    exportNumber: item.exportNumber ?? "",
    exportDate: item.exportDate?.substring(0, 10) ?? "",
    destinationDepartment: item.destinationDepartment ?? "",
    subject: item.subject ?? "",
    content: item.content ?? "",
  };

  modalInstance.show();
};

const closeModal = () => modalInstance.hide();

const save = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    if (isEdit.value) {
      await updateExport(currentId.value, form.value);
      successAlert("تم التعديل بنجاح");
    } else {
      await createExport(form.value);
      successAlert("تمت الإضافة بنجاح");
    }

    modalInstance.hide();
    await load();
  } catch (e) {
    console.error(e);
    errorAlert("فشلت العملية، حاول مرة أخرى");
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (!result.isConfirmed) return;

  try {
    await deleteExport(id);
    successAlert("تم الحذف بنجاح");
    await load();
  } catch (e) {
    console.error(e);
    errorAlert("فشل الحذف");
  }
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value && newPage !== page.value) {
    page.value = newPage;
    load();
  }
};

// ===== Archive =====
const openArchive = (item) => {
  currentExportId.value = item.id;
  archiveFiles.value = item.archiveExportFiles || [];
  archiveModalInstance.show();
};

const closeArchiveModal = () => archiveModalInstance.hide();

const openArchiveUploadFromView = () => {
  archiveModalInstance.hide();
  archiveUploadModalInstance.show();
};
const closeArchiveUpload = () => archiveUploadModalInstance.hide();

const onArchiveFilesSelected = (event, index) => {
  archiveInputs.value[index].files = Array.from(event.target.files);
};

const isUploadingArchive = ref(false);
const submitArchiveUpload = async () => {
  if (isUploadingArchive.value) return;

  const allFiles = archiveInputs.value.flatMap((x) => x.files);

  if (!currentExportId.value) return errorAlert("لا يوجد صادر محدد");
  if (!allFiles.length) return errorAlert("يرجى اختيار ملفات");

  isUploadingArchive.value = true;

  try {
    await uploadExportArchive(currentExportId.value, allFiles);
    successAlert("تم رفع المرفقات بنجاح");

    archiveInputs.value = [{ files: [] }];
    archiveUploadModalInstance.hide();
    await load();

    const updatedRow = list.value.find((x) => x.id === currentExportId.value);
    if (updatedRow) openArchive(updatedRow);
  } catch (e) {
    console.error(e);
    errorAlert("فشل رفع المرفقات");
  } finally {
    isUploadingArchive.value = false;
  }
};

const removeArchiveInput = (index) => {
  archiveInputs.value.splice(index, 1);
};

const addArchiveInput = () => {
  archiveInputs.value.push({ files: [] });
};

const openFile = (url) => window.open(url, "_blank");

const resetForm = () => {
  form.value = {
    typeExport: 2,
    exportNumber: "",
    exportDate: "",
    destinationDepartment: "",
    subject: "",
    content: "",
  };
};

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// ========== lifecycle ==========
onMounted(() => {
  modalInstance = new bootstrap.Modal(modalEl.value, {
    backdrop: "static",
    keyboard: false,
  });
  archiveModalInstance = new bootstrap.Modal(archiveModalEl.value, {
    backdrop: "static",
    keyboard: false,
  });
  archiveUploadModalInstance = new bootstrap.Modal(archiveUploadModal.value, {
    backdrop: "static",
    keyboard: false,
  });
  advancedSearchModalInstance = new bootstrap.Modal(advancedSearchModal.value, {
    backdrop: "static",
    keyboard: false,
  });
  load();
});

</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 600px;
  max-width: 95%;
}
</style>
