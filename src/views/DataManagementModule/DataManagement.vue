<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-folder2-open"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">الإدارة</h2>
        <small class="text-muted"
          >إدارة المذكرات – الأرقام والتواريخ والأصل</small
        >
      </div>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <!-- رقم المذكرة -->
      <div class="col-md-6">
        <!-- <label class="form-label">رقم المذكرة</label> -->
        <input
          v-model="filters.memoNumber"
          class="form-control"
          placeholder="بحث عن رقم المذكرة"
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
      <h5 class="mb-0 fw-bold primary">وارد شعبة الإدارة</h5>
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
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>هامش مسؤول الشعبة</th>
                <!-- <th>تاريخ الإدخال</th> -->
                <th>حالة المعاملة</th>
                <th>تاريخ الاستلام</th>
                <th>سبب الرفض</th>
                <th>تاريخ الرفض</th>
                <th>رقم المذكرة</th>
                <th>تاريخ المذكرة</th>
                <th>نوع الصادر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(m, i) in list" :key="m.id">
                <!-- رقم تسلسلي -->
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <!-- incoming -->
                <td>{{ m.incomingBookNumber ?? "-" }}</td>
                <td>{{ formatDate(m.incomingDate) }}</td>
                <td>{{ m.marginNoteDivision }}</td>
                <!-- createdAt -->
                <!-- <td>{{ formatDate(m.createdAt) }}</td> -->
                <td>
                  <span v-if="m.status === 0" class="badge bg-secondary">
                    <i class="bi bi-hourglass-split"></i> قيد الانتظار
                  </span>

                  <span v-else-if="m.status === 1" class="badge bg-success">
                    <i class="bi bi-check-circle-fill"></i> مقبول
                  </span>

                  <span v-else-if="m.status === 2" class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i> مرفوض
                  </span>
                </td>

                <!-- تواريخ إضافية -->
                <td>{{ formatDate(m.receiveDate) }}</td>
                <td>{{ m.rejectionReason ?? "-" }}</td>
                <td>{{ formatDate(m.rejectionDate) }}</td>

                <!-- memo -->
                <td>{{ m.memoNumber }}</td>
                <td>{{ formatDate(m.memoDate) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-secondary': m.isExport === 0,
                      'bg-primary': m.isExport === 1,
                      'bg-warning text-dark': m.isExport === 2,
                    }"
                  >
                    {{
                      m.isExport === 0
                        ? "لا يوجد"
                        : m.isExport === 1
                        ? "داخلي"
                        : m.isExport === 2
                        ? "خارجي"
                        : "غير معروف"
                    }}
                  </span>
                </td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- زر إضافة هامش -->
                    <button class="button-add" @click="openAdd(m.marginNoteId)">
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
                    <button
                      v-role="[0]"
                      class="button-edit"
                      @click="openEdit(m)"
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

                    <!-- حذف -->
                    <button v-role="[0]" class="button" @click="remove(m.id)">
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

                    <button class="button-view" @click="openView(m)">
                      <svg class="svgIcon" viewBox="0 0 576 512">
                        <path
                          d="M572.52 241.4C518.29 135.59 407.81 64 288 
                            64S57.71 135.59 3.48 241.4a48.07 48.07 
                            0 000 45.2C57.71 376.41 168.19 448 288 
                            448s230.29-71.59 284.52-161.4a48.07 48.07 
                            0 000-45.2zM288 400c-88.22 0-168.48-48.33-211.86-128C119.52 
                            192.33 199.78 144 288 144s168.48 48.33 
                            211.86 128C456.48 351.67 376.22 400 288 
                            400zm0-208a80 80 0 1080 80 80.09 80.09 
                            0 00-80-80z"
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

                    <button
                      class="button-archive"
                      title="عرض المرفقات"
                      @click="openArchive(m)"
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
                <td colspan="13" class="py-4 text-muted">
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

  <!-- Add/Edit Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            {{ editMode ? "تعديل بيانات " : "إضافة بيانات " }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">رقم المذكرة</label>
                <input
                  v-model="form.memoNumber"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ المذكرة</label>
                <input
                  v-model="form.memoDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">نوع الصادر</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.isExport"
                    :options="exportTypeOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    placeholder="اختر نوع الصادر"
                    class="vue-select"
                  />
                </div>
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
                    placeholder="اختر..."
                  />
                </div>
              </div> -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close()">
              إلغاء
            </button>
            <button
              type="submit"
              class="btn btn-add"
              :class="{ 'btn-saving': isSaving }"
              :disabled="isSaving"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{
                isSaving ? "جارٍ الحفظ..." : editMode ? "حفظ التعديل" : "إضافة"
              }}
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
          <h5 class="modal-title fw-bold primary">تحويل إلى قسم آخر</h5>
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
                    required
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

              <!-- <div class="col-md-12">
                <label class="form-label">المرفقات</label>
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="form-control"
                  multiple
                />
              </div> -->
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
            <button
              type="button"
              class="btn btn-add"
              :class="{ 'btn-saving': transferLoading }"
              :disabled="transferLoading"
              @click="transfer"
            >
              <span
                v-if="transferLoading"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ transferLoading ? "جارٍ التحويل..." : "تحويل" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- View Modal -->
  <div class="modal fade" tabindex="-1" ref="viewModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">عرض تفاصيل بيانات الهامش</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">تاريخ المذكرة</label>
              <div class="form-control">{{ viewItem.memoNumber }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ المذكرة</label>
              <div class="form-control">
                {{ formatDate(viewItem.memoDate) }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">ملف الأصل</label>
              <div class="form-control">
                <span v-if="viewItem.hasOriginalFile" class="badge bg-success">
                  نعم
                </span>
                <span v-else class="badge bg-secondary"> لا </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">اسم المُدخل</label>
              <div class="form-control">{{ viewItem.createdByUserName }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label">تاريخ الإدخال</label>
              <div class="form-control">
                {{ formatDate(viewItem.createdAt) }}
              </div>
            </div>

            <!-- <div class="col-md-12">
              <label class="form-label">رقم هامش المذكرة </label>
              <div class="view-box">{{ viewItem.marginNoteId }}</div>
            </div> -->
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeView">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div
    class="modal fade"
    ref="advancedModal"
    tabindex="-1"
    @hidden.bs.modal="resetFilters"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-sm border-0">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">رقم المذكرة</label>
              <input v-model="filters.memoNumber" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">من تاريخ المذكرة</label>
              <input
                type="date"
                v-model="filters.memoDateFrom"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ المذكرة</label>
              <input
                type="date"
                v-model="filters.memoDateTo"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">بحث</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Landa View Modal -->
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
          <button class="btn btn-primary" @click="openArchiveUploadFromView">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
          </button>
          <button class="btn btn-light" @click="closeArchive">إغلاق</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Upload Modal -->
  <div class="modal fade" ref="archiveUploadModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-cloud-upload me-1"></i>
            رفع مرفقات
          </h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(item, index) in archiveInputs"
            :key="index"
            class="d-flex gap-2 mb-2"
          >
            <input
              type="file"
              multiple
              class="form-control"
              @change="onArchiveFilesSelected($event, index)"
            />

            <button
              v-if="archiveInputs.length > 1"
              class="btn btn-outline-danger"
              @click="removeArchiveInput(index)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <button class="btn btn-search w-100 mt-3" @click="addArchiveInput">
            <i class="bi bi-plus-lg me-1"></i>
            إضافة مرفق آخر
          </button>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchiveUpload">
            إلغاء
          </button>
          <button class="btn btn-primary" @click="submitArchiveUpload">
            رفع
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import VueSelect from "vue3-select";
import {
  getLanda,
  addLanda,
  updateLanda,
  deleteLanda,
  transferLanda,
  getLandaViwe,
} from "@/services/Data-management.service.js";
import { getDepartments } from "@/services/departments.service.js";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
import {
  uploadIncomingArchive,
  getIncomingArchive,
} from "@/services/incoming-archive.service.js";

const route = useRoute();
const list = ref([]);
const loading = ref(false);

// ===== Pagination =====
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

const exportTypeOptions = [
  { label: "لا يوجد", value: 0 },
  { label: "صادر داخلي", value: 1 },
  { label: "صادر خارجي", value: 2 },
];

// ===== مودالات =====
const modalEl = ref(null);
const transferModalEl = ref(null);
let modal = null;
let transferModal = null;
const editMode = ref(false);

// ===== فورم الإضافة/التعديل =====
const form = reactive({
  id: "",
  marginNoteId: null,
  memoNumber: "",
  memoDate: "",
  isExport: 0,
  hasOriginalFile: false,
});

const departments = ref([]);
const transferForm = reactive({
  landaId: "",
  departmentId: "",
  notes: "",
  files: [],
});

const load = async () => {
  loading.value = true;

  try {
    // تجهيز فلتر hasOriginalFile
    let hasOriginal = null;
    if (filters.hasOriginalFile === "true") hasOriginal = true;
    else if (filters.hasOriginalFile === "false") hasOriginal = false;

    const res = await getLanda({
      pageNumber: page.value,
      pageSize,

      injuredName: filters.injuredName || null,
      marginNoteId: filters.marginNoteId || null,
      memoNumber: filters.memoNumber || null,
      memoDateFrom: filters.memoDateFrom || null,
      memoDateTo: filters.memoDateTo || null,
      hasOriginalFile: hasOriginal,
      createdByUserId: filters.createdByUserId || null,
    });

    list.value = res.data.data || [];
    totalPages.value = res.data.pagination?.totalPages ?? 1;

    // ================================
    // دمج memoNumber + memoDate (اختياري)
    // ================================
    await Promise.all(
      list.value.map(async (row) => {
        if (!row.id) return;

        try {
          const landaRes = await getLandaViwe({
            marginNoteId: row.id,
            pageNumber: 1,
            pageSize: 1,
          });

          const landa = landaRes.data.data?.[0];
          if (landa) {
            row.memoNumber = landa.memoNumber;
            row.memoDate = landa.memoDate;
          }
        } catch (err) {
          console.error("خطأ في دمج بيانات Landa:", err);
        }
      })
    );
  } catch (e) {
    console.error(e);
    errorAlert("فشل في جلب البيانات");
  } finally {
    loading.value = false;
  }
};

const loadDepartments = async () => {
  try {
    const res = await getDepartments({ pageNumber: 1, pageSize: 100 });
    departments.value = res.data.data;
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

const openAdd = (noteId) => {
  editMode.value = false;
  form.id = "";
  form.marginNoteId = noteId;
  form.memoNumber = "";
  form.memoDate = "";
  form.hasOriginalFile = false;
  modal.show();
};

const openEdit = (row) => {
  editMode.value = true;
  form.id = row.id;
  form.marginNoteId = row.marginNoteId;
  form.memoNumber = row.memoNumber;
  form.memoDate = row.memoDate ? row.memoDate.slice(0, 10) : "";
  form.hasOriginalFile = row.hasOriginalFile;
  form.isExport = row.isExport ?? 0;
  modal.show();
};

const isSaving = ref(false);

const save = async () => {
  if (isSaving.value) return;

  isSaving.value = true;

  const data = {
    marginNoteId: form.marginNoteId,
    memoNumber: form.memoNumber,
    memoDate: form.memoDate ? new Date(form.memoDate).toISOString() : null,
    hasOriginalFile: form.hasOriginalFile,
    isExport: form.isExport,
  };

  try {
    if (!editMode.value) {
      await addLanda(data);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateLanda(form.id, data);
      successAlert("تم التحديث بنجاح");
    }

    modal.hide();
    load();
  } catch (err) {
    errorAlert("فشل الحفظ");
    console.error(err);
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await deleteLanda(id);
      successAlert("تم الحذف بنجاح");
      load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  }
};

const close = () => modal.hide();
const openTransfer = (row) => {
  transferForm.landaId = row.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferForm.files = [];
  transferModal.show();
  console.log("Landa ID SENT =", transferForm.landaId);
};

const handleFileUpload = (event) => {
  transferForm.files = Array.from(event.target.files);
};

// ===== تنفيذ التحويل =====

const transferLoading = ref(false);
const transfer = async () => {
  if (transferLoading.value) return;

  transferLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("LandaId", transferForm.landaId);
    formData.append("DepartmentId", transferForm.departmentId);
    formData.append("Notes", transferForm.notes || "");

    if (transferForm.files?.length) {
      for (const file of transferForm.files) {
        formData.append("files", file);
      }
    }

    await transferLanda(formData);

    successAlert("تم التحويل بنجاح");
    transferModal.hide();
    load();
  } catch (e) {
    const serverMessage = e?.response?.data?.message || "حدث خطأ أثناء التحويل";
    transferModal.hide();
    errorAlert(serverMessage);
  } finally {
    transferLoading.value = false;
  }
};

const closeTransfer = () => transferModal.hide();
const changePage = (p) => {
  page.value = p;
  load();
};

const loadViewData = async (marginNoteId) => {
  const res = await getLandaViwe({
    pageNumber: 1,
    pageSize: 10,
    marginNoteId: marginNoteId,
  });

  return res.data.data;
};

const openView = async (row) => {
  try {
    const data = await loadViewData(row.id);
    if (!data || data.length === 0) {
      errorAlert(
        "لا توجد بيانات مرتبطة بهذا الهامش (رقم المذكرة و تاريخ المذكرة)"
      );
      return;
    }
    const item = data[0];
    viewItem.marginNoteId = item.marginNoteId;
    viewItem.memoNumber = item.memoNumber;
    viewItem.memoDate = item.memoDate;
    viewItem.hasOriginalFile = item.hasOriginalFile;
    viewItem.createdByUserName = item.createdByUserName;
    viewItem.createdAt = item.createdAt;

    viewModal.show();
  } catch (e) {
    console.error(e);
    errorAlert("فشل عرض البيانات");
  }
};

const viewModalEl = ref(null);
let viewModal = null;
const closeView = () => viewModal.hide();

const viewItem = reactive({
  memoNumber: "",
  memoDate: "",
  hasOriginalFile: false,
  createdByUserName: "",
  createdAt: "",
  marginNoteId: "",
});

const filters = reactive({
  injuredName: "",
  marginNoteId: "",
  memoNumber: "",
  memoDateFrom: "",
  memoDateTo: "",
  hasOriginalFile: "",
  createdByUserId: "",
});

const advancedModal = ref(null);
let modalAdvancedInstance = null;
const users = ref([
  // { id: "uuid", fullName: "اسم الموظف" }
]);

const openAdvanced = () => {
  modalAdvancedInstance = new bootstrap.Modal(advancedModal.value);
  modalAdvancedInstance.show();
};

const closeAdvanced = () => {
  modalAdvancedInstance.hide();
};

const applyAdvanced = () => {
  load();
  closeAdvanced();
};

const resetFilters = () => {
  Object.assign(filters, {
    injuredName: "",
    incomingId: "",
    managerNote: "",
    createdByUserId: "",
    createdAtFrom: "",
    createdAtTo: "",
    memoNumber: "",
    memoDateFrom: "",
    memoDateTo: "",
    hasOriginalFile: "",
  });
  load();
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

const archiveModalEl = ref(null);
const archiveUploadModalEl = ref(null);

let archiveModal = null;
let archiveUploadModal = null;

const archiveFiles = ref([]);

const archiveInputs = ref([{ files: [] }]);
const currentIncomingId = ref("");

/* فتح عرض المرفقات */
const openArchive = (row) => {
  if (!row.archiveIncoming || !row.archiveIncoming.items?.length) {
    archiveFiles.value = [];
  } else {
    archiveFiles.value = row.archiveIncoming.items;
  }

  archiveModal.show();
};

/* من العرض إلى الرفع */
const openArchiveUploadFromView = () => {
  archiveModal.hide();
  archiveUploadModal.show();
};

const closeArchive = () => archiveModal.hide();
const closeArchiveUpload = () => archiveUploadModal.hide();

/* اختيار ملفات */
const onArchiveFilesSelected = (e, index) => {
  archiveInputs.value[index].files = Array.from(e.target.files);
};

const addArchiveInput = () => {
  archiveInputs.value.push({ files: [] });
};

const removeArchiveInput = (index) => {
  archiveInputs.value.splice(index, 1);
};

/* رفع المرفقات */
const submitArchiveUpload = async () => {
  const files = archiveInputs.value.flatMap((x) => x.files);

  if (!files.length) {
    return errorAlert("يرجى اختيار ملفات");
  }

  try {
    await uploadIncomingArchive(currentIncomingId.value, files);
    archiveUploadModal.hide();
    await openArchive({ incomingId: currentIncomingId.value });
    successAlert("تم رفع المرفقات بنجاح");

    archiveInputs.value = [{ files: [] }];
    load(); // تحديث الجدول
  } catch (e) {
    errorAlert("فشل رفع المرفقات");
  }
};

const openFile = (url) => {
  window.open(url, "_blank");
};

onMounted(() => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  viewModal = new Modal(viewModalEl.value);
  archiveModal = new Modal(archiveModalEl.value);
  archiveUploadModal = new Modal(archiveUploadModalEl.value);
  load();
  loadDepartments();
});
</script>
