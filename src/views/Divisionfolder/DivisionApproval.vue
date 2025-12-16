<template>
  <!-- App Bar -->
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
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>الحالة</th>
                <th>سبب الرفض</th>
                <th>تاريخ الرفض</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(m, i) in list" :key="m.id">
                <td>{{ i + 1 }}</td>
                <td>{{ m.incomingBookNumber ?? "-" }}</td>
                <td>{{ formatDate(m.incomingDate) }}</td>

                <td>
                  <span v-if="m.status === 0" class="badge bg-secondary"
                    >
                    <i class="bi bi-hourglass-split"></i> قيد الانتظار</span
                  >
                  <span v-else-if="m.status === 1" class="badge bg-success"
                    >
                    <i class="bi bi-check-circle-fill"></i> مقبول</span
                  >
                  <span v-else class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i> مرفوض
                  </span>
                </td>

                <td>{{ m.rejectionReason ?? "-" }}</td>
                <td>{{ formatDate(m.rejectionDate) }}</td>

                <!-- الإجراءات -->
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- قبول -->
                    <button class="button-accept" @click="approve(m)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
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
                    <button class="button-reject" @click="openReject(m)">
                      <svg class="svgIcon" viewBox="0 0 384 512">
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
                </td>
              </tr>
              <tr v-if="list.length === 0">
                <td colspan="7" class="text-muted py-4">
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
          <button
            type="button"
            class="btn btn-light"
            @click="closeReject"
          >
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
  getMarginNotesDivisionTransfers,
  changeMarginNoteDivisionStatus,
} from "@/services/margin-notes-division.service.js";

const list = ref([]);
const loading = ref(false);

// ===============================
// LOAD DATA
// ===============================
const load = async () => {
  loading.value = true;
  try {
    const res = await getMarginNotesDivisionTransfers();
    list.value = res.data.data ?? [];
  } finally {
    loading.value = false;
  }
};

// ===============================
// STATUS CHANGE
// ===============================
const approve = async (row) => {
  await changeMarginNoteDivisionStatus({
    incomingId: row.incomingId,
    status: 1,
    rejectionReason: null,
  });
  load();
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
  rejection.incomingId = row.incomingId;
  rejection.reason = "";
  rejectModal.show();
};

const closeReject = () => rejectModal.hide();

const confirmReject = async () => {
  if (!rejection.reason.trim()) return;

  await changeMarginNoteDivisionStatus({
    incomingId: rejection.incomingId,
    status: 2,
    rejectionReason: rejection.reason,
  });

  rejectModal.hide();
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
  load();
});
</script>
