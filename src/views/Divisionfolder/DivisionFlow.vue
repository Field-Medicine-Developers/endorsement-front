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
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="اسم الجريح..."
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
                <th>#</th>
                <th>اسم الجريح</th>
                <th>موضوع الوارد</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>هامش مدير القسم</th>
                <th>هامش مسوؤل الشعبة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in list" :key="item.id">
                <td>{{ i + 1 }}</td>
                <td>
                  <div>
                    <div
                      v-for="(name, i) in item.injuredName
                        .split(',')
                        .slice(0, 3)"
                      :key="i"
                    >
                      • {{ name.trim() }}
                    </div>

                    <div
                      v-if="item.injuredName.split(',').length > 2"
                      class="show-more"
                      @click="
                        openNamesModal(
                          item.injuredName.split(',').map((n) => n.trim())
                        )
                      "
                    >
                      عرض الكل ({{ item.injuredName.split(",").length }})
                    </div>
                  </div>
                </td>

                <td>{{ item.incomingSubject }}</td>
                <td>{{ item.incomingBookNumber }}</td>
                <td>{{ formatDate(item.incomingDate) }}</td>
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openManagerNotes(item.managerNotes || [])"
                  >
                    عرض الهوامش ({{ item.managerNotes?.length || 0 }})
                  </button>
                </td>
                <td>{{ item.marginNoteDivision || "-" }}</td>
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
                          d="M135.2 17.7L128 32H32c-17.7 0-32 14.3-32 32s14.3 32 
                           32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 
                           6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 
                           128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h246c25.3 
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
                <td colspan="8" class="text-muted py-4">
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
              class="border-bottom py-2"
            >
              <div class="fw-bold mb-1">
                {{ i + 1 }}. {{ n.createdBy || "مدير القسم" }}
              </div>
              <div class="text-muted small mb-1">
                {{ formatDate(n.createdAt) }}
              </div>
              <div>
                {{ n.note }}
              </div>
            </div>
          </div>

          <p v-else class="text-muted text-center">لا توجد ملاحظات</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeManagerNotes">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
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
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
/* ---------------- State ------------------ */
const loading = ref(false);
const list = ref([]);
const departments = ref([]);

const filters = reactive({
  injuredName: "",
  managerNote: "",
});

/* ---------------- Load Data ------------------ */
const load = async () => {
  loading.value = true;
  try {
    const res = await getMarginNotesDivision({
      pageNumber: 1,
      pageSize: 50,
      injuredName: filters.injuredName || null,
      managerNote: filters.managerNote || null,
    });
    list.value = res.data.data ?? [];
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  filters.injuredName = "";
  filters.managerNote = "";
  load();
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
let modal = null;

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
const transferModalEl = ref(null);
let transferModal = null;

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

const close = () => modal.hide();
const closeTransfer = () => transferModal.hide();
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

/* ---------------- Init ------------------ */
onMounted(async () => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  managerNotesModal = new Modal(managerNotesModalEl.value);
  await load();
  const res = await getDepartments({ pageNumber: 1, pageSize: 200 });
  departments.value = res.data.data;
  if (namesModal.value) {
    namesModalInstance = new Modal(namesModal.value);
  }
});
</script>
