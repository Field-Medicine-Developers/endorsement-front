<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-left-right"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">مراسلات الاسترجاع</h2>
        <small class="text-muted">المعاملات الواردة إلى قسم الاسترجاع</small>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="fw-bold mb-0">قائمة مراسلات الاسترجاع</h5>
    </div>

    <div class="card-body">

<!-- Spinner -->
<div v-if="loading" class="spinner-wrapper">
  <div class="spinner"></div>
</div>

<!-- Table -->
<div v-else class="card inner-card">
  <div class="table-responsive">
    <table class="table custom-table text-center align-middle">
      <thead>
        <tr>
          <th>#</th>
          <th>عدد الوارد</th>
          <th>تاريخ الوارد</th>
          <th>موضوع الكتاب</th>
          <th>من قسم</th>
          <th>الإجراءات</th>
        </tr>
      </thead>

            <tbody>
              <tr v-for="(item, i) in list" :key="item.id">
                <td>{{ i + 1 }}</td>
                <td>{{ item.incomingBookNumber }}</td>
                <td>{{ formatDate(item.incomingDate) }}</td>
                <td>{{ item.incomingSubject }}</td>
                <td>{{ item.departmentName }}</td>

                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="button-add" @click="openAdd(item)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M432 256c0 17.7-14.3 32-32 32h-128v128c0 17.7-14.3 32-32 
                          32s-32-14.3-32-32V288H80c-17.7 0-32-14.3-32-32s14.3-32 
                          32-32h128V96c0-17.7 14.3-32 32-32s32 14.3 
                          32 32v128h128c17.7 0 32 14.3 32 32z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="6" class="text-muted py-4">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد مراسلات واردة
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
  <div class="modal fade" ref="modalAdd">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">إضافة معاملة إرجاع</h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <!-- صندوق معلومات الجريح -->
            <div class="return-info-box mb-4">
              <div class="row g-3">
                <!-- اسم الجريح -->
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-icon"
                      ><i class="bi bi-person-fill"></i
                    ></span>
                    <div class="info-text">
                      <span class="label">اسم الجريح</span>
                      <span class="value">{{ form.injuredName }}</span>
                    </div>
                  </div>
                </div>

                <!-- موضوع الكتاب -->
                <div class="col-md-6">
                  <div class="info-row">
                    <span class="info-icon"
                      ><i class="bi bi-journal-bookmark-fill"></i
                    ></span>
                    <div class="info-text">
                      <span class="label">موضوع الكتاب</span>
                      <span class="value">{{ form.incomingSubject }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grid 6 + 6 -->
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">تاريخ الإدخال</label>
                <input
                  type="datetime-local"
                  v-model="form.Date"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الاستلام</label>
                <input
                  type="datetime-local"
                  v-model="form.ReceiveDate"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">نسبة الاسترجاع</label>
                <input
                  type="text"
                  v-model="form.ReturnPercentage"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الاسترجاع</label>
                <input
                  type="datetime-local"
                  v-model="form.ReturnDate"
                  class="form-control"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">المرفقات</label>
                <input
                  type="file"
                  multiple
                  @change="onFilesSelect"
                  class="form-control"
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">الملاحظات</label>
                <textarea v-model="form.notes" class="form-control"></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" type="button" @click="closeAdd">
              إغلاق
            </button>
            <button class="btn btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

import {
  getReturnTransfers,
  addReturnFollowUp,
} from "@/services/return-transactions.service.js";
import { successAlert, errorAlert } from "@/utils/alert.js";

// DATA
const list = ref([]);
const loading = ref(false);

// modal
const modalAdd = ref(null);
let modalAddInstance = null;

// form
const form = reactive({
  AuditingAndDataId: "",
  Date: "",
  injuredName: "",
  incomingSubject: "",
  ReceiveDate: "",
  ReturnPercentage: "",
  ReturnDate: "",
  notes: "",
  files: [],
});

const onFilesSelect = (e) => {
  form.files = Array.from(e.target.files);
};

// load transfers
const load = async () => {
  loading.value = true;
  try {
    const res = await getReturnTransfers({});
    list.value = res.data.data || [];
  } catch (err) {
    errorAlert("فشل تحميل المراسلات");
  } finally {
    loading.value = false;
  }
};

// open modal
const openAdd = (row) => {
  Object.assign(form, {
    AuditingAndDataId: row.auditingAndDataId, // ✔ هذا الصحيح
    Date: "",
    injuredName: row.injuredName,
    incomingSubject: row.incomingSubject,
    ReceiveDate: "",
    ReturnPercentage: "",
    ReturnDate: "",
    notes: "",
    files: [],
  });

  modalAddInstance.show();
};

// save
const save = async () => {
  try {
    const fd = new FormData();

    fd.append("AuditingAndDataId", form.AuditingAndDataId);
    fd.append("Date", form.Date);
    fd.append("ReceiveDate", form.ReceiveDate);
    fd.append("ReturnPercentage", form.ReturnPercentage);
    fd.append("ReturnDate", form.ReturnDate);
    fd.append("Notes", form.notes);

    form.files.forEach((f) => fd.append("files", f));

    await addReturnFollowUp(fd);

    successAlert("تمت إضافة معاملة الاسترجاع بنجاح");
    modalAddInstance.hide();
    load();
  } catch (err) {
    errorAlert("حدث خطأ أثناء الإضافة");
  }
};

// close
const closeAdd = () => modalAddInstance.hide();

// format date
const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString();
};

onMounted(() => {
  modalAddInstance = new Modal(modalAdd.value);
  load();
});
</script>
