<template>
  <div class="dashboard container-fluid mt-0">
    <!-- Incoming Tracking Card -->
    <div class="card shadow-sm border-0 mb-4 p-4 track-card">
      <div class="d-flex align-items-center mb-3">
        <h5 class="fw-bold mb-0">تتبع الوارد</h5>
      </div>
      <div class="track-search-modern">
        <div class="search-field">
          <i class="bi bi-person"></i>
          <input
            v-model="trackForm.injuredName"
            placeholder="اسم الجريح"
            @keyup.enter="track"
          />
        </div>

        <div class="search-field">
          <i class="bi bi-journal-text"></i>
          <input
            v-model="trackForm.incomingBookNumber"
            placeholder="رقم الكتاب (اختياري)"
            @keyup.enter="track"
          />
        </div>

        <button class="btn-search" @click="track">تتبع الوارد</button>
      </div>
    </div>

    <!-- Appbar -->
    <div
      class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center gap-2">
        <span
          class="appbar-icon d-inline-flex align-items-center justify-content-center"
        >
          <i class="bi bi-clipboard2-pulse"></i>
        </span>
        <div>
          <h2 class="h5 fw-bold m-2">لوحة التحكم</h2>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="spinner-wrapper">
      <div class="spinner"></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Cards Row -->
      <div
        class="icons-box p-4 border rounded-4 d-flex justify-content-around align-items-center flex-wrap"
      >
        <div class="icon-card text-center">
          <i class="bi bi-inbox"></i>
          <h6>الوارد</h6>
          <span>{{ stats.incomingsCount }}</span>
        </div>

        <div class="icon-card text-center">
          <i class="bi bi-envelope-paper"></i>
          <h6>الهامش الإداري</h6>
          <span>{{ stats.marginNotesCount }}</span>
        </div>

        <div class="icon-card text-center">
          <i class="bi bi-diagram-3"></i>
          <h6>الإدارة</h6>
          <span>{{ stats.landaCount }}</span>
        </div>

        <div class="icon-card text-center">
          <i class="bi bi-arrow-counterclockwise"></i>
          <h6>الاسترجاع</h6>
          <span>{{ stats.returnTransactionsCount }}</span>
        </div>

        <div class="icon-card text-center">
          <i class="bi bi-shield-check"></i>
          <h6>التدقيق والبيانات</h6>
          <span>{{ stats.auditingAndDataCount }}</span>
        </div>

        <div class="icon-card text-center">
          <i class="bi bi-info-circle"></i>
          <h6>الإجراءات</h6>
          <span>{{ stats.actionTypeCount }}</span>
        </div>
      </div>

      <!-- Chart Row -->
      <div class="charts-box mt-5 p-4 border rounded-4">
        <div class="d-flex align-items-center mb-4">
          <h5 class="fw-bold mb-0">إحصائيات التأييدات</h5>
        </div>

        <div class="chart-card p-3 border rounded-3 shadow-sm">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Track Result Modal -->
  <div class="modal fade" ref="trackModalEl" tabindex="-1">
    <div
      class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable"
    >
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">تفاصيل تتبع الوارد</h5>
        </div>

        <div class="modal-body track-modal-body">
          <!-- Incoming Info Card -->
          <div class="info-card">
            <div class="info-header">
              <i class="bi bi-folder2-open"></i>
              <h6>معلومات الوارد</h6>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span>رقم الكتاب</span>
                <strong>{{ trackResult.incomingBookNumber }}</strong>
              </div>

              <div class="info-item">
                <span>التشكيل</span>
                <strong>{{ trackResult.formationName }}</strong>
              </div>

              <div class="info-item">
                <span>الجهة المرسلة</span>
                <strong>{{ trackResult.source }}</strong>
              </div>
            </div>
          </div>

          <!-- Injured Names -->
          <div v-if="trackResult.injuredNames.length" class="info-card">
            <div class="info-header">
              <i class="bi bi-people"></i>
              <h6>الأسماء المرتبطة</h6>
            </div>

            <div class="injured-tags">
              <span
                v-for="(n, i) in trackResult.injuredNames"
                :key="i"
                class="injured-badge"
              >
                <i class="bi bi-person-check"></i>
                {{ n }}
              </span>
            </div>
          </div>

          <!-- Transfers Timeline -->
          <div v-if="trackResult.transfers.length" class="info-card">
            <div class="info-header">
              <i class="bi bi-arrow-left-right"></i>
              <h6>مسار التحويل</h6>
            </div>

            <ul class="timeline-modern">
              <li v-for="t in trackResult.transfers" :key="t.id">
                <span class="timeline-dot"></span>
                <div class="timeline-card">
                  <strong>{{ t.departmentName }}</strong>

                  <div class="timeline-meta">
                    المرحلة {{ t.stage }} · {{ formatDate(t.createdAt) }} ·
                    {{ t.createdByUserName }}
                  </div>

                  <div class="timeline-dates">
                    استلام: {{ formatDate(t.receiveDate) || "-" }} | تسليم:
                    {{ formatDate(t.deliveryDate) || "-" }}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Actions Timeline -->
          <div v-if="trackResult.actions.length" class="info-card">
            <div class="info-header">
              <i class="bi bi-lightning"></i>
              <h6>الإجراءات</h6>
            </div>

            <ul class="timeline-modern actions">
              <li v-for="(a, i) in trackResult.actions" :key="i">
                <span class="timeline-dot action"></span>
                <div class="timeline-card">
                  <strong>{{ a.description }}</strong>

                  <div class="timeline-meta">
                    {{ formatDate(a.actionDate) }} · {{ a.createdByUserName }}
                  </div>

                  <div
                    v-if="a.additionalInfo?.ManagerNote"
                    class="timeline-note"
                  >
                    <i class="bi bi-chat-left-text"></i>
                    {{ a.additionalInfo.ManagerNote }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import {
  getDashboardStats,
  trackIncoming,
} from "@/services/dashboard.service.js";
import { successAlert, errorAlert, warningAlert } from "@/utils/alert.js";

const loading = ref(true);
let chart = null;

const stats = ref({
  incomingsCount: 0,
  marginNotesCount: 0,
  landaCount: 0,
  returnTransactionsCount: 0,
  auditingAndDataCount: 0,
  actionTypeCount: 0,
  finalStatusTypeCount: 0,
  pendingIncomingsAfterTwoDaysCount: 0,
});

/* --------- إنشاء الشارت بعد وصول البيانات --------- */
const renderChart = () => {
  const ctx = document.getElementById("lineChart");

  if (!ctx) return;

  // حذف شارت سابق (إذا حدث تحديث)
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["الوارد", "الهامش", "التدقيق", "الإرجاع"],
      datasets: [
        {
          label: "الإحصائيات",
          data: [
            stats.value.incomingsCount,
            stats.value.marginNotesCount,
            stats.value.auditingAndDataCount,
            stats.value.returnTransactionsCount,
          ],
          borderColor: "#12b1d1",
          backgroundColor: "rgba(18,177,209,0.25)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

import { Modal } from "bootstrap";

const trackModalEl = ref(null);
let trackModal = null;

const trackForm = ref({
  injuredName: "",
  incomingBookNumber: "",
});

const trackResult = ref({
  incomingBookNumber: "",
  incomingDate: null,
  subject: "",
  source: "",
  content: "",
  formationName: "",
  injuredNames: [],
  transfers: [],
  actions: [],
});

const track = async () => {
  if (!trackForm.value.injuredName && !trackForm.value.incomingBookNumber) {
    return warningAlert("يرجى إدخال اسم الجريح أو رقم الكتاب");
  }

  try {
    const res = await trackIncoming(trackForm.value);
    trackResult.value = res.data.data;
    successAlert("تم العثور على معلومات الوارد");
    requestAnimationFrame(() => {
      trackModal.show();
    });
  } catch (e) {
    console.error(e);
    errorAlert("لم يتم العثور على معلومات مطابقة");
  }
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/* --------- تحميل بيانات الـ Dashboard --------- */
onMounted(async () => {
  try {
    trackModal = new Modal(trackModalEl.value);
    const res = await getDashboardStats();
    stats.value = res.data.data;

    // انتظر DOM بعد التحديث
    setTimeout(() => {
      renderChart();
    }, 150);
  } catch (err) {
    console.error("Dashboard error:", err);
  }

  loading.value = false;
});
</script>

<style scoped>
.btn-search {
  width: 100%;
  height: 47px;
  font-size: 1rem;
  border-radius: 14px;
}

.icons-box {
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  padding: 2rem !important;
}

/* Cards */
.icon-card {
  flex: 1 1 150px;
  margin: 0.8rem;
  padding: 1.5rem 1rem;
  background: #12b1d10e;
  border-radius: 0.8rem;
  border: 2px solid #12b1d1;
  box-shadow: 0 4px 10px rgba(18, 177, 209, 0.15);
  text-align: center;
  transition: 0.3s;
  opacity: 0;
  animation: slideDown 0.8s ease forwards;
}

.icon-card:nth-child(1) {
  animation-delay: 0.1s;
}
.icon-card:nth-child(2) {
  animation-delay: 0.2s;
}
.icon-card:nth-child(3) {
  animation-delay: 0.3s;
}
.icon-card:nth-child(4) {
  animation-delay: 0.4s;
}
.icon-card:nth-child(5) {
  animation-delay: 0.5s;
}
.icon-card:nth-child(6) {
  animation-delay: 0.6s;
}

.icon-card:hover {
  transform: translateY(-6px) scale(1.05);
}

.icon-card i {
  font-size: 2.5rem;
  color: #12b1d1;
}

.icon-card h6 {
  margin: 0.3rem 0;
  font-weight: 600;
  color: #333;
}

.icon-card span {
  font-size: 1.2rem;
  font-weight: 700;
  color: #12b1d1;
}

/* Charts */
.charts-box {
  background: #fff;
  border: 2px solid #12b1d1;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.chart-card {
  height: 260px;
}

/* Animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.track-card {
  background: linear-gradient(135deg, #f8fcfd, #ffffff);
  border-left: 5px solid #12b1d1;
}

.track-result textarea {
  resize: none;
}

.track-search-modern {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  align-items: center;
}

.search-field {
  position: relative;
}

.search-field i {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: #12b1d1;
  font-size: 1.1rem;
}

.search-field input {
  width: 100%;
  padding: 12px 44px 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #dbe9ee;
  font-size: 0.95rem;
  transition: 0.3s;
}

.search-field input:focus {
  outline: none;
  border-color: #12b1d1;
  box-shadow: 0 0 0 3px rgba(18, 177, 209, 0.15);
}

.btn-track {
  background: linear-gradient(135deg, #12b1d1, #0fa0be);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 12px 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}

.btn-track:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(18, 177, 209, 0.35);
}

/* Modal Body */
.track-modal-body {
  background: #f9fbfc;
}

/* Info Card */
.info-card {
  background: #fff;
  border-radius: 18px;
  padding: 20px 22px;
  margin-bottom: 22px;
  border: 1px solid #e4f0f5;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.info-header i {
  font-size: 1.4rem;
  color: #12b1d1;
}

.info-header h6 {
  margin: 0;
  font-weight: 800;
  color: #333;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item span {
  font-size: 0.8rem;
  color: #777;
}

.info-item strong {
  display: block;
  font-size: 0.95rem;
  color: #111;
  margin-top: 4px;
}

/* Injured Badges */
.injured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.injured-badge {
  background: rgba(18, 177, 209, 0.12);
  border: 1px solid #12b1d1;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0c6f85;
}

/* Timeline */
.timeline-modern {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-modern li {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  background: #12b1d1;
  border-radius: 50%;
  margin-top: 10px;
  flex-shrink: 0;
}

.timeline-dot.action {
  background: #6c757d;
}

.timeline-card {
  background: #f8fcfd;
  border-radius: 14px;
  padding: 12px 16px;
  width: 100%;
  border: 1px solid #e2eef3;
}

.timeline-meta {
  font-size: 0.78rem;
  color: #777;
  margin: 4px 0;
}

.timeline-dates {
  font-size: 0.75rem;
  color: #555;
}

.timeline-note {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #444;
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>
