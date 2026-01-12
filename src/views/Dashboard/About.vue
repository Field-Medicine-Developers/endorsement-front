<template>
  <div class="dashboard container-fluid mt-0">
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
          <small class="text-muted">
            عرض الاحصائيات مع تتبع تأييدات الجرحى
          </small>
        </div>
      </div>
      <div class="btn-wrapper">
        <button
          class="btn-search w-100"
          data-bs-toggle="modal"
          data-bs-target="#achievementsModal"
          @click="loadAchievements"
        >
          <i class="bi bi-bar-chart"></i>
          عرض إحصائيات الإنجاز
        </button>
      </div>
    </div>

    <!-- Incoming Tracking Card -->
    <div class="card shadow-sm border-0 mb-4 p-4 track-card">
      <div class="d-flex align-items-center mb-3 gap-2">
        <span class="track-icon">
          <i class="bi bi-arrow-repeat"></i>
        </span>
        <h5 class="fw-bold mb-0 track-title">تتبع الوارد</h5>
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
        <div class="d-flex align-items-center mb-4 gap-2">
          <span class="track-icon">
            <i class="bi bi-bar-chart-line"></i>
          </span>
          <h5 class="fw-bold mb-0 track-title">إحصائيات التأييدات</h5>
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
  <strong>{{ trackResult?.createdByUserName || "—" }}</strong>
</div>
              <div class="info-item">
                <span>الجهة الاصابة</span>
                <strong>{{ trackResult.subject }}</strong>
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
                    {{ formatDate(a.actionDate) }} ·
                    {{ a.createdByUserName || "غير معروف" }}
                  </div>

                  <!-- الهامش (كما هو) -->
                  <div
                    v-if="a.additionalInfo?.ManagerNote"
                    class="timeline-note"
                  >
                    <i class="bi bi-chat-left-text"></i>
                    {{ a.additionalInfo.ManagerNote }}
                  </div>

                  <!--  الإضافة الجديدة: تغيير الحالة -->
                  <div
                    v-if="a.actionType === 'StatusChange'"
                    class="timeline-status"
                  >
                    <div>
                      <strong>الحالة:</strong>
                      {{
                        a.additionalInfo?.Status === "Approved"
                          ? "موافق عليه"
                          : a.additionalInfo?.Status === "Rejected"
                          ? "مرفوض"
                          : a.additionalInfo?.Status || "-"
                      }}
                    </div>

                    <div v-if="a.additionalInfo?.ReceiveDate">
                      <strong>تاريخ الاستلام:</strong>
                      {{ a.additionalInfo.ReceiveDate }}
                    </div>

                    <div v-if="a.additionalInfo?.RejectionReason">
                      <strong>سبب الرفض:</strong>
                      {{ a.additionalInfo.RejectionReason }}
                    </div>

                    <div v-if="a.additionalInfo?.RejectionDate">
                      <strong>تاريخ الرفض:</strong>
                      {{ a.additionalInfo.RejectionDate }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-light"
                @click="closeTrackModal"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="achievementsModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <!-- <i class="bi bi-bar-chart-line me-1"></i> -->
            إحصائيات الإنجاز
          </h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Loading -->
          <div v-if="achievementLoading" class="text-center py-5">
            <div class="spinner-border text-info"></div>
          </div>

          <!-- Cards -->
          <div v-else class="row g-4 achievements-cards">
            <div
              class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
              v-for="(item, i) in achievementCards"
              :key="i"
            >
              <div class="achievement-card">
                <div class="achievement-icon">
                  <i :class="`bi ${item.icon}`"></i>
                </div>

                <div class="achievement-content">
                  <h6 class="achievement-title">{{ item.title }}</h6>
                  <div class="achievement-value">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            إغلاق
          </button>

          <button
            class="btn btn-primary px-4"
            :disabled="achievementLoading"
            @click="printReport"
          >
            <i class="bi bi-printer ms-1"></i>
            طباعة التقرير
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Print Area (Hidden) -->
  <div id="print-area" style="display: none; direction: rtl; text-align: right">
    <h3 class="print-title">تقرير إحصائيات الإنجاز</h3>

    <table class="print-table" style="width: 100%; border-collapse: collapse">
      <tbody>
        <tr>
          <td>عدد الوارد</td>
          <td>{{ achievements.incomingCount }}</td>
        </tr>

        <tr>
          <td>الاسترجاع</td>
          <td>{{ achievements.isReturnCount }}</td>
        </tr>

        <tr>
          <td>الموظفين الحكومي</td>
          <td>{{ achievements.governmentCount }}</td>
        </tr>

        <tr>
          <td>الموظفين المدني</td>
          <td>{{ achievements.civilianCount }}</td>
        </tr>

        <tr>
          <td>الاعتذارات</td>
          <td>{{ achievements.apologyCount }}</td>
        </tr>

        <tr>
          <td>المرضى</td>
          <td>{{ achievements.patientCount }}</td>
        </tr>

        <tr>
          <td>مكتب المعاون</td>
          <td>{{ achievements.assistantOfficeCount }}</td>
        </tr>

        <tr class="total">
          <td><strong>العدد الكلي</strong></td>
          <td>
            <strong>{{ achievements.totalCount }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Chart from "chart.js/auto";
import {
  getDashboardStats,
  trackIncoming,
  getAchievements,
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

/* --------- Chart --------- */
const renderChart = () => {
  const ctx = document.getElementById("lineChart");

  if (!ctx) return;

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
  createdByUserName: "",
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
    const data = res.data.data;

    trackResult.value = {
      incomingBookNumber: data.incomingBookNumber || "",
      incomingDate: data.incomingDate || null,
      subject: data.subject || "",
      source: data.source || "",
      createdByUserName: data.createdByUserName || "",
      content: data.content || "",
      formationName: data.formationName || "",

      injuredNames: Array.isArray(data.injuredNames) ? data.injuredNames : [],

      transfers: Array.isArray(data.transfers) ? data.transfers : [],

      actions: Array.isArray(data.actions) ? data.actions : [],
    };

    successAlert("تم العثور على معلومات الوارد");
    requestAnimationFrame(() => trackModal.show());
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

const closeTrackModal = () => {
  if (!trackModal) return;
  trackModal.hide();
};

const achievementFilter = ref({
  year: new Date().getFullYear(),
  month: null,
  day: null,
});

const achievementLoading = ref(false);

const achievements = ref({
  incomingCount: 0,
  isReturnCount: 0,
  governmentCount: 0,
  civilianCount: 0,
  apologyCount: 0,
  patientCount: 0,
  assistantOfficeCount: 0,
  totalCount: 0,
});

/* تحميل البيانات */
const loadAchievements = async () => {
  achievementLoading.value = true;
  try {
    const res = await getAchievements(achievementFilter.value);
    achievements.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    achievementLoading.value = false;
  }
};

/* بحث مرن */
watch(
  () => ({ ...achievementFilter.value }),
  () => {
    loadAchievements();
  }
);

const achievementCards = computed(() => [
  {
    title: "عدد الوارد",
    value: achievements.value.incomingCount,
    icon: "bi-inbox",
  },
  {
    title: "الاسترجاع",
    value: achievements.value.isReturnCount,
    icon: "bi-arrow-counterclockwise",
  },
  {
    title: "المؤيدين الحكومي",
    value: achievements.value.governmentCount,
    icon: "bi-person-badge",
  },
  {
    title: "المؤيدين الميداني",
    value: achievements.value.civilianCount,
    icon: "bi-people",
  },
  {
    title: "الاعتذارات",
    value: achievements.value.apologyCount,
    icon: "bi-x-circle",
  },
  {
    title: "المرضى",
    value: achievements.value.patientCount,
    icon: "bi-heart-pulse",
  },
  {
    title: "مكتب المعاون",
    value: achievements.value.assistantOfficeCount,
    icon: "bi-building",
  },
  {
    title: "العدد الكلي",
    value: achievements.value.totalCount,
    icon: "bi-bar-chart-line",
  },
]);
const printReport = () => {
  const printContent = document.getElementById("print-area").innerHTML;
  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html lang="ar">
      <head>
        <title>تقرير الإحصائيات</title>
        <style>
          body { font-family: Arial; direction: rtl; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          td { border: 1px solid #000; padding: 8px; }
          .total { font-weight: bold; color: red; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  win.document.close();
  win.print();
};

/* --------- تحميل بيانات الـ Dashboard --------- */
onMounted(async () => {
  try {
    trackModal = new Modal(trackModalEl.value);
    const res = await getDashboardStats();
    stats.value = res.data.data;
    setTimeout(() => {
      renderChart();
    }, 150);
  } catch (err) {
    console.error("Dashboard error:", err);
  }

  loading.value = false;
});
</script>