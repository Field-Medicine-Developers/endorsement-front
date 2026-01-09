<template>
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-shield-check"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">المراسلات</h2>
        تغيير حالة المعاملة: قبول أو رفض
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة معاملات التدقيق</h5>
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
                <!-- <th>اسم الجريح</th> -->
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <!-- <th>موضوع الوارد</th> -->
                <!-- <th>أضيف بواسطة</th> -->
                <!-- <th>تاريخ الإضافة</th> -->
                <th>الحالة</th>
                <th>تاريخ الاستلام</th>
                <th>سبب الرفض</th>
                <th>تاريخ الرفض</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, idx) in list" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <!-- <td>{{ item.injuredName || "-" }}</td> -->
                <td>{{ item.incomingBookNumber || "-" }}</td>
                <td>{{ formatDate(item.incomingDate) }}</td>
                <!-- <td>{{ item.incomingSubject || "-" }}</td> -->
                <!-- <td>{{ item.createdByUserName }}</td> -->
                <!-- <td>{{ formatDate(item.createdAt) }}</td> -->

                <!-- الحالة -->
                <td>
                  <span v-if="item.status === 0" class="badge bg-secondary">
                    <i class="bi bi-hourglass-split"></i>
                    قيد الانتظار
                  </span>

                  <span v-else-if="item.status === 1" class="badge bg-success">
                    <i class="bi bi-check-circle-fill"></i>
                    مقبول
                  </span>

                  <span v-else-if="item.status === 2" class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i>
                    مرفوض
                  </span>
                </td>

                <td>{{ formatDate(item.incomingReceiveDate) }}</td>
                <td>{{ item.rejectionReason || "-" }}</td>
                <td>{{ formatDate(item.rejectionDate) }}</td>

                <td>
                  <!-- إذا الحالة انتظار -->
                  <div
                    v-if="item.status === 0"
                    class="d-flex justify-content-center gap-2"
                  >
                    <!-- قبول -->
                    <button
                      class="button-accept"
                      title="قبول المعاملة"
                      @click="approve(item)"
                      :disabled="
                        approvingId === item.id || rejectingId === item.id
                      "
                    >
                      <span
                        v-if="approvingId === item.id"
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
                      title="رفض المعاملة"
                      @click="openReject(item)"
                      :disabled="rejectingId === item.id"
                    >
                      <span
                        v-if="rejectingId === item.id"
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
                  <!-- إذا ليست انتظار -->
                  <span v-else class="text-muted">—</span>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="10" class="py-4 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>لا توجد بيانات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Reject Modal -->
  <div class="modal fade" tabindex="-1" ref="rejectModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <form class="modal-content" @submit.prevent="submitReject">
        <div class="modal-header">
          <h5 class="modal-title">سبب الرفض</h5>
        </div>

        <div class="modal-body">
          <textarea
            v-model="rejectForm.reason"
            class="form-control"
            rows="4"
            placeholder="أدخل سبب الرفض"
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
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

import {
  getTransfers,
  changeStatusAuditing,
} from "@/services/auditing-and-data.service.js";

import { successAlert, errorAlert } from "@/utils/alert.js";

const list = ref([]);
const loading = ref(false);

// ========== تحميل البيانات ==========
const load = async () => {
  loading.value = true;
  try {
    const res = await getTransfers({});
    list.value = res?.data?.data || [];
  } catch (e) {
    console.error("LOAD ERROR:", e);
  } finally {
    loading.value = false;
  }
};

const approvingId = ref(null);
const rejectingId = ref(null);

// ========== قبول ==========
const approve = async (item) => {
  if (approvingId.value || rejectingId.value) return;

  approvingId.value = item.id;
  try {
    await changeStatusAuditing({
      incomingId: item.incomingId,
      status: 1,
      rejectionReason: null,
    });

    successAlert("تم قبول المعاملة");
    load();
  } catch (e) {
    errorAlert("فشل قبول المعاملة");
  } finally {
    approvingId.value = null;
  }
};

// ========== رفض ==========
const rejectForm = reactive({
  incomingId: "",
  reason: "",
});

const rejectModalEl = ref(null);
let rejectModal;

// فتح المودال
const openReject = (item) => {
  rejectForm.incomingId = item.incomingId;
  rejectForm.reason = "";
  rejectModal.show();
};

// إغلاق المودال
const closeReject = () => rejectModal.hide();

const submitReject = async () => {
  if (!rejectForm.reason.trim()) {
    errorAlert("يجب كتابة سبب الرفض");
    return;
  }

  try {
    await changeStatusAuditing({
      incomingId: rejectForm.incomingId,
      status: 2,
      rejectionReason: rejectForm.reason,
    });

    successAlert("تم رفض المعاملة");
    rejectModal.hide();
    load();
  } catch (e) {
    errorAlert("فشل رفض المعاملة");
  } finally {
    rejectingId.value = null;
  }
};

// ========== التاريخ ==========
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt)) return "-";
  return `${dt.getFullYear()}/${String(dt.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(dt.getDate()).padStart(2, "0")}`;
};

// ========== INIT ==========
onMounted(() => {
  rejectModal = new Modal(rejectModalEl.value);
  load();
});
</script>
