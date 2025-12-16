<template>

    <!-- App Bar -->
    <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-receipt"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">مراسلات الهامش</h2>
        <small class="text-muted">تغيير حالة المعاملة: قبول أو رفض</small>
      </div>
    </div>
  </div>

  <div class="card shadow-sm p-3">
    <div v-if="loading" class="spinner-wrapper">
      <div class="spinner"></div>
    </div>

    <table v-else class="table table-bordered text-center align-middle">
      <thead>
        <tr>
          <th>#</th>
          <!-- <th>اسم الجريح</th> -->
          <!-- <th>موضوع الوارد</th> -->
          <th>رقم الوارد</th>
          <th>تاريخ الوارد</th>
          <th>الحالة</th>
          <th>سبب الرفض</th>
          <th>الإجراءات</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in list" :key="item.id">
          <td>{{ i + 1 }}</td>
          <!-- <td>
            <div>
              <div>{{ item.injuredNames?.[0] }}</div>

              <div
                v-if="item.injuredNames && item.injuredNames.length > 1"
                class="show-more"
                @click="openNamesModal(item.injuredNames)"
              >
                عرض الكل ({{ item.injuredNames.length }})
              </div>
            </div>
          </td> -->

          <!-- <td>{{ item.incomingSubject }}</td> -->
          <td>{{ item.incomingBookNumber }}</td>
          <td>{{formatDate( item.incomingDate) }}</td>

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

          <td>{{ item.rejectionReason || "-" }}</td>

          <td>
            <div class="d-flex justify-content-center gap-2">
              <!-- قبول -->
              <button
                class="button-accept"
                title="قبول المعاملة"
                @click="approve(item)"
              >
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
              <button
                class="button-reject"
                title="رفض المعاملة"
                @click="openReject(item)"
              >
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
      </tbody>
    </table>

    <!-- Reject Modal -->
    <div class="modal fade" tabindex="-1" ref="rejectModalEl">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="submitReject">
            <div class="modal-header">
              <h5 class="modal-title">سبب الرفض</h5>
            </div>

            <div class="modal-body">
              <textarea
                v-model="reason"
                class="form-control"
                rows="4"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-light"
                @click="closeReject()"
              >
                إلغاء
              </button>
              <button type="submit" class="btn btn-confirmReject">رفض</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Names Modal – عرض كل أسماء الجرحى -->
  <div class="modal fade" tabindex="-1" ref="namesModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">أسماء الجرحى</h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(name, i) in allNames"
            :key="i"
            class="name-item border-bottom py-2"
          >
            • {{ name }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeNamesModal()">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { successAlert, errorAlert } from "@/utils/alert.js";

import {
  getMarginNotes,
  changeMarginNoteStatus,
} from "@/services/margin-note.service.js";

const list = ref([]);
const loading = ref(false);

const reason = ref("");
const rejectId = ref(null);

const rejectModalEl = ref(null);
let rejectModal = null;

const load = async () => {
  loading.value = true;

  try {
    const res = await getMarginNotes({});

    list.value = res.data.data.map((item) => ({
      ...item,

      // تقسيم الأسماء إلى مصفوفة
      injuredNames: item.injuredName
        ? item.injuredName.split(",").map((n) => n.trim())
        : [],
    }));
  } catch (err) {
    console.error(err);
    errorAlert("فشل في تحميل البيانات");
  } finally {
    loading.value = false;
  }
};

const approve = async (row) => {
  await changeMarginNoteStatus({
    incomingId: row.incomingId,
    status: 1,
    rejectionReason: null,
  });

  successAlert("تم قبول المعاملة");
  load();
};

const openReject = (row) => {
  rejectId.value = row.incomingId;
  reason.value = "";
  rejectModal.show();
};

const submitReject = async () => {
  await changeMarginNoteStatus({
    incomingId: rejectId.value,
    status: 2,
    rejectionReason: reason.value,
  });

  successAlert("تم رفض المعاملة");
  rejectModal.hide();
  load();
};

const closeReject = () => rejectModal.hide();

const allNames = ref([]);
const namesModalEl = ref(null);
let namesModal = null;

const openNamesModal = (names) => {
  allNames.value = names;
  namesModal.show();
};

const closeNamesModal = () => {
  namesModal.hide();
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date)) return "—";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}/${m}/${d}`;
};


onMounted(() => {
  rejectModal = new Modal(rejectModalEl.value);
  namesModal = new Modal(namesModalEl.value);
  load();
});
</script>
