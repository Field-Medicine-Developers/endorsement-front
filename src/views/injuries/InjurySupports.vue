<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
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

    <button class="btn btn-primary" @click="openAdd()">إضافة تأييد جديد</button>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث باسم الجريح..."
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load()">بحث</button>
        <button class="btn-advanced" @click="resetFilters()">
          إعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة تأييدات الإصابة</h5>
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
                <th>الأم</th>
                <th>نوع الإصابة</th>
                <th>الحالة</th>
                <th>رقم الكتاب</th>
                <th>تاريخ الحادث</th>
                <th>التشكيل</th>
                <th>QR</th>
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
                <td>{{ formatDate(item.accidentDate) }}</td>
                <td>{{ item.formationName }}</td>

                <!-- QR Code -->
                <td>
                  <!-- <div class="qr-circle">
                     <qrcode-vue :value="getQRUrl(item.injuredPersonId, item)" :size="70" level="H" />        
                   </div> -->

                  <button
                    class="btn btn-search"
                    @click="openQR(getQRUrl(item))"
                  >
                    عرض QR
                  </button>
                </td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(item)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 2.5-4.1 5.7-4.6 9.1l-12 84
                                c-1.1 7.5 5.3 13.9 12.8 12.8l84-12c3.4-.5 6.6-2.1 9.1-4.6l197.5-197.5
                                -89.3-89.3z M497.9 56.69l-42.6-42.6c-18.7-18.7-49.1-18.7-67.9 0
                                l-39.1 39.1 89.3 89.3 39.1-39.1c18.8-18.7 18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <!-- حذف -->
                    <button class="button" @click="removeItem(item.id)">
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
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="10" class="py-5 text-muted">
                  <i class="bi bi-inboxes fs-1"></i>
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

  <!-- Add/Edit Modal -->
  <div class="modal fade" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل التأييد" : "إضافة تأييد" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">اسم الجريح</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.injuredPersonId"
                    :options="incomings"
                    label="label"
                    :reduce="(o) => o.value"
                    searchable
                    placeholder="ابحث عن الجريح…"
                    @option:selected="onInjuredSelected"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">اسم الأم</label>
                <input v-model="form.motherName" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الولادة</label>
                <input
                  v-model="form.birthDate"
                  type="date"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الهاتف</label>
                <input v-model="form.phoneNumber" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">نوع الإصابة</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.injuryType"
                    :options="injuryTypeOptions"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="اختر نوع الإصابة"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">الحالة</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.status"
                    :options="injuryStatusSelect"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="اختر الحالة"
                    searchable
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الكتاب</label>
                <input v-model="form.bookNumber" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الحادث</label>
                <input
                  v-model="form.accidentDate"
                  type="datetime-local"
                  class="form-control"
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

              <div class="col-md-6">
                <label class="form-label">التشكيل</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.formationId"
                    :options="formationsSelect"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="اختر التشكيل"
                    searchable
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="modal.hide()">
              إلغاء
            </button>
            <button class="btn btn-primary">
              {{ editMode ? "حفظ التعديل" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- QR Modal -->
<!-- QR Modal -->
<div class="modal fade" ref="qrModalEl">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content qr-modal">
      <div class="qr-header">
        <h4>رمز  QR</h4>
      </div>

      <div class="qr-body text-center">
        <div id="qrPrintArea">
          <qrcode-vue :value="selectedQR" :size="210" level="H" />
          <!-- <p class="qr-url mt-3">{{ selectedQR }}</p> -->
        </div>
      </div>

      <div class="modal-footer">
        <!-- <button class="btn btn-outline-secondary w-50" @click="printQR">
        طباعة
        </button> -->
        <button type="button" class="btn btn-light" @click="modal.hide()">
              إلغاء
            </button>
        <button class="btn btn-primary " @click="openQRInTab">
         عرض المعلومات 
        </button>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
/* ---------------------- Imports ----------------------- */
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import QrcodeVue from "qrcode.vue";
import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";
import api from "@/services/services.js";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";

import {
  getInjurySupports,
  addInjurySupport,
  updateInjurySupport,
  deleteInjurySupport,
  getIncomings,
  getFormations,
} from "@/services/injury-supports.service.js";

/* ---------------------- ENUMS ----------------------- */
const injuryTypeOptions = [
  { value: 0, label: "حكومي" },
  { value: 1, label: "ميداني" },
  { value: 2, label: "أهلي" },
  { value: 3, label: "أخرى" },
];

const injuryStatusOptions = [
  { value: 0, label: "جريح" },
  { value: 1, label: "مريض" },
];

// هذه تستخدم في الجدول لعرض النص
const injuryTypeText = (v) =>
  injuryTypeOptions.find((x) => x.value === v)?.label ?? v;

const injuryStatusText = (v) =>
  injuryStatusOptions.find((x) => x.value === v)?.label ?? v;

// هذه تستخدم في VueSelect للحالة
const injuryStatusSelect = injuryStatusOptions;

/* ---------------------- STATE ----------------------- */
const list = ref([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const allIncomingsRaw = ref([]);

const filters = reactive({
  injuredName: "",
});

/* الجرحى من incoming */
const incomings = ref([]);

/* تشكيلات + VueSelect-ready */
const formations = ref([]);
const formationsSelect = ref([]);

/* ---------------------- Form Model ----------------------- */
const form = reactive({
  id: "",
  injuredPersonId: "",
  motherName: "",
  birthDate: "",
  phoneNumber: "",
  injuryType: null,
  accidentDate: "",
  bookNumber: "",
  accidentPlace: "",
  injuryPlace: "",
  formationId: null,
  status: 0,
  year: new Date().getFullYear(),
});

/* ---------------------- Pagination ----------------------- */
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

/* ---------------------- MODALS ----------------------- */
const modalEl = ref(null);
let modal = null;

const qrModalEl = ref(null);
let qrModal = null;
const selectedQR = ref("");

/* ---------------------- HELPERS ----------------------- */
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const resetForm = () => {
  Object.assign(form, {
    id: "",
    injuredPersonId: "",
    motherName: "",
    birthDate: "",
    phoneNumber: "",
    injuryType: null,
    accidentDate: "",
    bookNumber: "",
    accidentPlace: "",
    injuryPlace: "",
    formationId: null,
    status: 0,
    year: new Date().getFullYear(),
  });
};

const resetFilters = () => {
  filters.injuredName = "";
  page.value = 1;
  load();
};

/* ---------------------- LOAD LIST ----------------------- */
const load = async () => {
  loading.value = true;
  try {
    const res = await getInjurySupports({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
    });

    const resp = res.data;
    list.value = resp.data || [];
    totalPages.value = resp.pagination?.totalPages || 1;
  } catch (e) {
    console.error(e);
    errorAlert("فشل تحميل البيانات");
  }
  loading.value = false;
};

/* ---------------------- LOAD INCOMINGS ----------------------- */
const loadIncomings = async () => {
  try {
    const res = await getIncomings();
    const data = res.data.data || [];

    allIncomingsRaw.value = data;

    incomings.value = data.flatMap((x) =>
      x.injuredPersonIds.map((pid, index) => ({
        value: pid,
        label: x.injuredNames[index],
      }))
    );

    return incomings.value;
  } catch (e) {
    console.error("خطأ تحميل الجرحى", e);
    return [];
  }
};

const getInjuredPersonIdForSupport = (support) => {
  const incoming = allIncomingsRaw.value.find(
    (x) => x.id === support.incomingId
  );
  if (!incoming) return null;

  const index = incoming.injuredNames.indexOf(support.injuredName);
  if (index === -1) return null;

  return incoming.injuredPersonIds[index] || null;
};

const onInjuredSelected = (value) => {
  const p = incomings.value.find((x) => x.value === value);
  if (!p) return;

  form.injuredPersonId = value;
  form.motherName = p.motherName || "";
  form.birthDate = p.birthDate?.substring(0, 10) || "";
};

/* ---------------------- LOAD FORMATIONS ----------------------- */
const loadFormations = async () => {
  try {
    const res = await getFormations();

    const data = res.data.data || res.data || [];
    formations.value = data;

    formationsSelect.value = formations.value.map((f) => ({
      value: f.id,
      label: f.name,
    }));
  } catch (e) {
    console.error("فشل جلب التشكيلات", e);
  }
};

/* ---------------------- ACTIONS ----------------------- */
const editMode = ref(false);

const openAdd = async () => {
  editMode.value = false;
  await loadIncomings();
  resetForm();
  modal.show();
};

const openEdit = async (item) => {
  editMode.value = true;

  await loadIncomings();
  Object.assign(form, {
    id: item.id,
    injuredPersonId: item.injuredPersonId,
    motherName: item.motherName,
    birthDate: item.birthDate?.substring(0, 10) || "",
    phoneNumber: item.phoneNumber,
    injuryType: item.injuryType,
    accidentDate: item.accidentDate?.substring(0, 16) || "",
    bookNumber: item.bookNumber,
    accidentPlace: item.accidentPlace,
    injuryPlace: item.injuryPlace,
    formationId: item.formationId,
    status: item.status,
    year: item.year || new Date().getFullYear(),
  });

  modal.show();
};

const save = async () => {
  if (!form.injuredPersonId) {
    return errorAlert("يرجى اختيار اسم الجريح");
  }
  const body = {
    injuredPersonId: form.injuredPersonId,
    motherName: form.motherName,
    birthDate: form.birthDate,
    phoneNumber: form.phoneNumber,
    injuryType: form.injuryType,
    accidentDate: form.accidentDate,
    bookNumber: form.bookNumber,
    accidentPlace: form.accidentPlace,
    injuryPlace: form.injuryPlace,
    formationId: form.formationId,
    status: form.status,
    year: form.year,
  };

  try {
    if (!editMode.value) {
      await addInjurySupport(body);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateInjurySupport(form.id, body);
      successAlert("تم حفظ التعديلات");
    }

    modal.hide();
    load();
  } catch (e) {
    console.error(e);
    errorAlert("فشل الحفظ");
  }
};

const removeItem = async (id) => {
  const c = await confirmDelete("هل أنت متأكد من الحذف؟");
  if (!c.isConfirmed) return;

  try {
    await deleteInjurySupport(id);
    successAlert("تم الحذف بنجاح");
    load();
  } catch {
    errorAlert("فشل الحذف");
  }
};

/* ---------------------- QR ----------------------- */
const getBaseUrl = () => {
  if (window.location && window.location.origin) {
    return window.location.origin;
  }
  return "http://ems-api.somee.com/api";
};

const getQRUrl = (item) => {
  const hostname = window.location.hostname;

  // 1- لو النظام يشتغل محليًا على الكمبيوتر
  if (hostname === "localhost") {
    return `http://localhost:5173/injury-support-view/${item.id}`;
  }

  // 2- لو النظام يشتغل على شبكة LAN (كمبيوتر + موبايل)
  if (
    hostname.startsWith("192.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.")
  ) {
    return `http://${hostname}:5173/injury-support-view/${item.id}`;
  }

  // 3- لو النظام مرفوع على دومين (Production)
  return `https://${hostname}/injury-support-view/${item.id}`;
};

const openQR = (code) => {
  console.log("QR URL =", code);

  selectedQR.value = code;
  qrModal.show();
  // window.open(code, "_blank");
};

const openQRInTab = () => {
  if (!selectedQR.value) return;
  window.open(selectedQR.value, "_blank");
};

const printQR = () => {
  const printContent = document.getElementById("qrPrintArea").innerHTML;
  const w = window.open("", "", "width=600,height=600");

  w.document.write(`
    <html>
      <head>
        <title>طباعة رمز QR</title>
        <style>
          body {
            font-family: Cairo, sans-serif;
            text-align: center;
            padding: 30px;
          }
          img, canvas {
            margin: auto;
          }
          p {
            margin-top: 15px;
            font-size: 14px;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  w.document.close();
  w.focus();
  w.print();
  w.close();
};


/* ---------------------- INIT ----------------------- */
onMounted(() => {
  modal = new Modal(modalEl.value);
  qrModal = new Modal(qrModalEl.value);

  load();
  loadIncomings();
  loadFormations();
});
</script>

<style>
.qr-circle {
  background: white;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: 0.25s;
}

.qr-circle:hover {
  transform: scale(1.07);
}

.qr-modal {
  border-radius: 20px !important;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  border: none;
  background: #ffffff;
  animation: fadeIn 0.25s ease;
}

.qr-header {
  padding: 18px;
  text-align: center;
  color: rgb(22, 21, 21);
}

.qr-header h4 {
  margin: 0;
  font-weight: 700;
}

.qr-body {
  padding: 25px;
}

.qr-link {
  font-size: 14px;
  color: #444;
  word-break: break-all;
  direction: ltr;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}

.qr-footer {
  padding: 15px;
  background: #f5f5f5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
