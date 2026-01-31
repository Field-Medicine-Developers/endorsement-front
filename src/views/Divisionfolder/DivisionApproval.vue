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
        <i class="bi bi-file-earmark-arrow-right"></i>
        <h2 class="h5 fw-bold m-2">مراسلات الإدارة</h2>
        <small class="text-muted">قبول أو رفض المراسلات مع سبب الرفض</small>
      </div>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3 align-items-end">
      <!-- بحث سريع بالاسم فقط -->
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث باسم الجريح..."
          @keyup.enter="searchQuick"
        />
      </div>

      <!-- الأزرار -->
      <div class="col-md-6 d-flex justify-content-end gap-2">
        <button class="btn-search" @click="searchQuick">بحث</button>
        <button class="btn-advanced" @click="openAdvanced">بحث متقدم</button>
        <button class="btn-advanced" @click="resetFilters">إعادة تعيين</button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold">قائمة المراسلات</h5>
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
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>عدد الكتاب</th>
                <th>تاريخ الكتاب</th>
                <th>القيادة / التشكيل</th>
                <th>هامش مسؤول القسم</th>
                <th>الموضوع</th>
                <th>المحتوى</th>
                <th>تاريخ الاستلام</th>
                <th>حالة المعاملة</th>
                <th>سبب الرفض</th>
                <th>تاريخ الرفض</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(m, i) in list" :key="m.id">
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>

                <!-- اسم الجريح -->
                <td>
                  <div v-for="(n, x) in m.injuredNames || []" :key="x">
                    • {{ n }}
                  </div>
                  <span v-if="!m.injuredNames?.length">—</span>
                </td>

                <td>{{ m.incomingBookNumber ?? "-" }}</td>
                <td>{{ formatDate(m.incomingDate) }}</td>
                <td>{{ m.bookCount ?? "-" }}</td>
                <td>{{ formatDate(m.bookDate) }}</td>

                <!-- القيادة / التشكيل -->
                <td>
                  <div class="fw-bold">{{ m.commandName || "—" }}</div>
                  <small class="text-muted">
                    {{ m.formationName  || "—" }}</small
                  >
                </td>

                <!-- هامش مسؤول القسم -->
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openManagerNotes(m.managerNotes || [])"
                  >
                    عرض الهوامش ({{ m.managerNotes?.length || 0 }})
                  </button>
                </td>

                <!-- الموضوع -->
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openTextModal('الموضوع', m.subject)"
                  >
                    عرض الموضوع ({{ m.subject ? 1 : 0 }})
                  </button>
                </td>

                <!-- المحتوى -->
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openTextModal('المحتوى', m.content)"
                  >
                    عرض المحتوى ({{ m.subject ? 1 : 0 }})
                  </button>
                </td>

                <!-- تاريخ الاستلام -->
                <td>{{ formatDate(m.receiveDate) }}</td>

                <!-- الحالة -->
                <td>
                  <span v-if="m.status === 0" class="badge bg-secondary"
                    >قيد الانتظار</span
                  >
                  <span v-else-if="m.status === 1" class="badge bg-success"
                    >مقبول</span
                  >
                  <span v-else class="badge bg-danger">مرفوض</span>
                </td>

                <!-- سبب الرفض -->
                <td>{{ m.rejectionReason ?? "-" }}</td>

                <!-- تاريخ الرفض -->
                <td>{{ formatDate(m.rejectionDate) }}</td>

                <!-- الإجراءات -->
                <td>
                  <!-- إذا الحالة انتظار -->
                  <div
                    v-if="m.status === 0"
                    class="d-flex justify-content-center gap-2"
                  >
                    <!-- قبول -->
                    <button
                      class="button-accept"
                      @click="approve(m)"
                      :disabled="approvingId === m.id || rejectingId === m.id"
                    >
                      <span
                        v-if="approvingId === m.id"
                        class="spinner-border spinner-border-sm text-light"
                      ></span>

                      <svg v-else class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M173.9 439.4L7 272.5c-9.4-9.4-9.4-24.6 
                             0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 
                             33.9 0L192 345.4 448.5 88.9c9.4-9.4 24.6-9.4 
                             33.9 0L505 111.5c9.4 9.4 9.4 24.6 
                             0 34L214.6 439.4c-9.4 9.4-24.6 9.4-33.9 0z"
                        />
                      </svg>
                    </button>

                    <!-- رفض -->
                    <button
                      class="button-reject"
                      @click="openReject(m)"
                      :disabled="rejectingId === m.id || approvingId === m.id"
                    >
                      <span
                        v-if="rejectingId === m.id"
                        class="spinner-border spinner-border-sm text-light"
                      ></span>

                      <svg v-else class="svgIcon" viewBox="0 0 384 512">
                        <path
                          d="M231.6 256l142.8-142.8c12.5-12.5 12.5-32.7 
                            0-45.2L352 46.1c-12.5-12.5-32.7-12.5-45.2 
                            0L192 160.8 77.2 46.1C64.7 33.6 44.5 33.6 32 
                            46.1L9.4 68.7c-12.5 12.5-12.5 32.7 
                            0 45.2L152.2 256 9.4 398.8c-12.5 12.5-12.5 32.7 
                            0 45.2L32 466.1c12.5 12.5 32.7 12.5 
                            45.2 0L192 351.2l114.8 114.8c12.5 12.5 32.7 12.5 
                            45.2 0l22.6-22.6c12.5-12.5 12.5-32.7 
                            0-45.2L231.6 256z"
                        />
                      </svg>
                    </button>
                  </div>
                  <span v-else class="text-muted">—</span>
                </td>
              </tr>
              <tr v-if="list.length === 0">
                <td colspan="15" class="text-muted py-4">
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
    <nav
      v-if="totalPages > 1"
      class="circle-pagination d-flex justify-content-center mt-4"
    >
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

  <!-- Reject Modal -->
  <div class="modal fade" tabindex="-1" ref="rejectModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="confirmReject">
        <div class="modal-header">
          <h6 class="modal-title">سبب الرفض</h6>
        </div>

        <div class="modal-body">
          <textarea
            v-model="rejection.reason"
            class="form-control"
            rows="3"
            placeholder="اكتب سبب الرفض..."
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeReject">
            إلغاء
          </button>
          <button class="btn btn-confirmReject">رفض</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Manager Notes Modal -->
  <div class="modal fade" tabindex="-1" ref="managerNotesModalEl">
    <div
      class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">هوامش مسؤول القسم</h5>
        </div>

        <div class="modal-body">
          <div v-if="selectedManagerNotes.length">
            <div
              v-for="(n, i) in selectedManagerNotes"
              :key="i"
              class="border-bottom py-3"
            >
              <div class="fw-bold mb-1">{{ i + 1 }}. هامش</div>

              <div class="text-muted small mb-2">
                {{ formatDate(n.noteDate) }}
              </div>

              <div class="note-box">
                {{ n.managerNote || "—" }}
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

  <!-- Advanced Search Modal -->
  <div class="modal fade" tabindex="-1" ref="advancedModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">البحث المتقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">رقم الوارد</label>
              <input
                type="number"
                v-model.number="filters.incomingBookNumber"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الوارد</label>
              <input
                type="date"
                v-model="filters.incomingDate"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">عدد الكتاب</label>
              <input
                type="number"
                v-model.number="filters.bookCount"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الكتاب</label>
              <input
                type="date"
                v-model="filters.bookDate"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">الموضوع</label>
              <input
                type="text"
                v-model="filters.subject"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">المحتوى</label>
              <input
                type="text"
                v-model="filters.content"
                class="form-control"
              />
            </div>

            <!-- Command -->
            <div class="col-md-6">
              <div class="custom-vue-select-container">
                <label class="form-label">القيادة</label>
                <VueSelect
                  v-model="filters.commandId"
                  :options="commands"
                  label="label"
                  :reduce="(o) => o.value"
                  placeholder="الكل"
                  clearable
                  searchable
                />
              </div>
            </div>

            <!-- Formation -->
            <div class="col-md-6">
              <div class="custom-vue-select-container">
                <label class="form-label">التشكيل</label>
                <VueSelect
                  v-model="filters.formationId"
                  :options="formations"
                  label="name"
                  :reduce="(o) => o.id"
                  placeholder="الكل"
                  clearable
                  searchable
                />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced">إلغاء</button>
          <button class="btn btn-primary" @click="applyAdvanced">بحث</button>
        </div>
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
  getMarginNotesDivisionTransfers,
  changeMarginNoteDivisionStatus,
} from "@/services/margin-notes-division.service.js";
import { getFormations, getCommands } from "@/services/formations.service.js";

const list = ref([]);
const loading = ref(false);

// ===============================
// Pagination
// ===============================
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

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  load();
};

const filters = reactive({
  injuredName: "",
  formationId: null,
  commandId: null,
  bookCount: null,
  bookDate: null,
  incomingBookNumber: null,
  incomingDate: null,
  subject: "",
  content: "",
});

const resetFilters = () => {
  filters.injuredName = "";
  filters.formationId = null;
  filters.commandId = null;
  filters.bookCount = null;
  filters.bookDate = null;
  filters.incomingBookNumber = null;
  filters.incomingDate = null;
  filters.subject = "";
  filters.content = "";
  page.value = 1;
  load();
};

// ===============================
// LOAD DATA
// ===============================
const load = async () => {
  loading.value = true;

  try {
    const res = await getMarginNotesDivisionTransfers({
      pageNumber: page.value,
      pageSize: pageSize,
      injuredName: filters.injuredName || null,
      formationId: filters.formationId || null,
      commandId: filters.commandId || null,
      bookCount: filters.bookCount || null,

      bookDate: filters.bookDate
        ? new Date(filters.bookDate).toISOString()
        : null,
      incomingBookNumber: filters.incomingBookNumber || null,
      incomingDate: filters.incomingDate
        ? new Date(filters.incomingDate).toISOString()
        : null,
      subject: filters.subject || null,
      content: filters.content || null,
    });
    list.value = res?.data?.data || [];
    totalPages.value = res?.data?.pagination?.totalPages ?? 1;
  } finally {
    loading.value = false;
  }
};

const formations = ref([]);
const commands = ref([]);

const loadFormations = async () => {
  try {
    const res = await getFormations();
    formations.value = (res?.data?.data || []).map((f) => ({
      id: f.id,
      name: f.name,
    }));
  } catch {
    formations.value = [];
  }
};

const loadCommands = async () => {
  try {
    const res = await getCommands();
    commands.value = (res?.data?.data || []).map((c) => ({
      value: c.id,
      label: c.name,
    }));
  } catch {
    commands.value = [];
  }
};

// ===============================
// STATUS CHANGE
// ===============================

const approvingId = ref(null);
const rejectingId = ref(null);

const approve = async (row) => {
  if (approvingId.value || rejectingId.value) return;

  approvingId.value = row.id;

  try {
    await changeMarginNoteDivisionStatus({
      incomingId: row.incomingId,
      status: 1,
      rejectionReason: null,
    });
    load();
  } finally {
    approvingId.value = null;
  }
};

// ===============================
// REJECT MODAL
// ===============================
const rejectModalEl = ref(null);
let rejectModal;

const rejection = reactive({
  incomingId: "",
  reason: "",
});

const openReject = (row) => {
  if (approvingId.value) return;
  rejectingId.value = row.id;
  rejection.incomingId = row.incomingId;
  rejection.reason = "";
  rejectModal.show();
};

const closeReject = () => {
  rejectModal.hide();
  rejectingId.value = null;
  rejection.reason = "";
  rejection.incomingId = "";
};

const confirmReject = async () => {
  if (!rejection.reason.trim()) return;

  try {
    await changeMarginNoteDivisionStatus({
      incomingId: rejection.incomingId,
      status: 2,
      rejectionReason: rejection.reason,
    });
    rejectModal.hide();
    load();
  } finally {
    rejectingId.value = null;
  }
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

// ===============================
// ManagerNotes Modal
// ===============================

const selectedManagerNotes = ref([]);
const managerNotesModalEl = ref(null);
let managerNotesModal = null;

const openManagerNotes = (notes = []) => {
  selectedManagerNotes.value = Array.isArray(notes) ? notes : [];
  managerNotesModal.show();
};

const closeManagerNotes = () => {
  managerNotesModal.hide();
};

// ===============================
// Advanced Search Modal
// ===============================

const advancedModal = ref(null);
let modalAdvancedInstance = null;

const openAdvanced = () => {
  if (!modalAdvancedInstance) {
    modalAdvancedInstance = new Modal(advancedModal.value);
  }
  modalAdvancedInstance.show();
};

const closeAdvanced = () => {
  modalAdvancedInstance?.hide();
};

const applyAdvanced = () => {
  page.value = 1;
  load();
  closeAdvanced();
};

const searchQuick = () => {
  page.value = 1;
  load();
};

// ===============================
// HELPERS
// ===============================
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
};

onMounted(() => {
  rejectModal = new Modal(rejectModalEl.value);
  managerNotesModal = new Modal(managerNotesModalEl.value);
  textModalInstance = new Modal(textModalEl.value);
  loadFormations();
  loadCommands();
  load();
});
</script>
