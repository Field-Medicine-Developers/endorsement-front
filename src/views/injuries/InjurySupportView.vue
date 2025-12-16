<template>
  <div class="page-container">
    <!-- Load State -->
    <div v-if="loading" class="spinner-wrapper">
      <div class="spinner"></div>
    </div>

    <!-- No Data -->
    <div v-else-if="!data" class="text-center text-danger py-5">
      لا توجد بيانات لهذا الرقم.
    </div>

    <!-- Certificate -->
    <div v-else>
      <div id="captureArea" class="certificate-wrapper">
        <!-- Header -->
        <div class="certificate-header">
          <h1>تأييد إصابة</h1>
          <span class="subtitle">البيانات الرسمية للجريح</span>
        </div>

        <!-- Table -->
        <table class="info-table elegant">
          <tbody>
            <tr>
              <th>اسم الجريح</th>
              <td>{{ data.injuredName }}</td>
            </tr>
            <tr>
              <th>اسم الأم</th>
              <td>{{ data.motherName }}</td>
            </tr>
            <tr>
              <th>نوع الإصابة</th>
              <td>{{ injuryTypeText(data.injuryType) }}</td>
            </tr>
            <tr>
              <th>الحالة</th>
              <td>{{ injuryStatusText(data.status) }}</td>
            </tr>
            <tr>
              <th>تاريخ الحادث</th>
              <td>{{ formatDate(data.accidentDate) }}</td>
            </tr>
            <tr>
              <th>مكان الحادث</th>
              <td>{{ data.accidentPlace }}</td>
            </tr>
            <tr>
              <th>مكان الإصابة</th>
              <td>{{ data.injuryPlace }}</td>
            </tr>
            <tr>
              <th>التشكيل</th>
              <td>{{ data.formationName }}</td>
            </tr>
            <tr>
              <th>رقم الكتاب</th>
              <td>{{ data.bookNumber }}</td>
            </tr>
            <tr>
              <th>السنة</th>
              <td>{{ data.year }}</td>
            </tr>
          </tbody>
        </table>
        <!-- Footer -->
        <div class="form-footer">
          <div>
            <span>التاريخ:</span>
            <strong>{{ formatDate(new Date()) }}</strong>
          </div>

          <!-- <div class="stamp-box">
      <span>التوقيع والختم</span>
    </div> -->
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="btn btn-primary" @click="printPage">طباعة</button>
        <button class="btn btn-success" @click="saveImage">تحميل</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import html2canvas from "html2canvas";
import { useRoute } from "vue-router";
import api from "@/services/services.js";

const route = useRoute();
const loading = ref(true);
const data = ref(null);

const injuryTypeText = (v) => ["حكومي", "ميداني", "أهلي", "أخرى"][v] ?? v;
const injuryStatusText = (v) => ["جريح", "مريض"][v] ?? v;

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const loadData = async () => {
  try {
    const id = route.params.id;
    const res = await api.get(`/InjurySupports/${id}`);
    data.value = res.data?.data || null;
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
};

const printPage = () => window.print();

const saveImage = async () => {
  const el = document.getElementById("captureArea");
  const canvas = await html2canvas(el, { scale: 2, useCORS: true });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `injury-support-${route.params.id}.png`;
  link.click();
};

onMounted(loadData);
</script>

<style>
body {
  font-family: "Cairo", sans-serif;
  background: #f4f6f9;
}

/* الصفحة */
.page-container {
  max-width: 900px;
  margin: auto;
  padding: 30px 20px;
}

/* الشهادة */
.certificate-wrapper {
  background: #ffffff;
  width: 200mm; /* عرض A4 */
  min-height: 180mm; /* ارتفاع A4 */
  margin: auto;
  padding: 25mm 20mm;
  border: 1px solid #000;
  border-radius: 0; /* ⬅️ مهم */
  box-shadow: none; /* ⬅️ مهم */
}

/* الهيدر */
.certificate-header {
  text-align: center;
  padding-bottom: 25px;
  margin-bottom: 30px;
  /* border-bottom: 3px solid #0d6efd; */
}

.certificate-header h1 {
  font-size: 34px;
  font-weight: 900;
  color: #0d2b45;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 15px;
  color: #6c757d;
}

/* الجدول */
.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 17px;
}

.info-table th {
  width: 35%;
  padding: 14px 16px;
  background: #f8fafc;
  color: #0d2b45;
  font-weight: 700;
  border: 1px solid #e3ebf3;
  text-align: right;
}

.info-table td {
  padding: 14px 16px;
  border: 1px solid #e3ebf3;
  color: #212529;
}

/* Footer */
.certificate-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 45px;
}

.footer-right span {
  color: #6c757d;
  font-size: 14px;
}

.footer-right strong {
  display: block;
  font-size: 16px;
  margin-top: 4px;
}

.signature-box {
  width: 220px;
  height: 90px;
  border: 2px dashed #adb5bd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 14px;
}

/* الأزرار */
.actions {
  text-align: center;
  margin-top: 30px;
}

.actions button {
  padding: 12px 34px;
  font-size: 17px;
  border-radius: 10px;
  margin: 6px;
  min-width: 150px;
}

/* الطباعة */
@media print {
  body {
    background: #fff;
  }

  .actions {
    display: none;
  }

  .certificate-wrapper {
    border: none;
  }
}

.certificate-header {
  text-align: center;
  margin-bottom: 20px;
}

.certificate-header h1 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #555;
}

.certificate-header::after {
  content: "";
  display: block;
  width: 100%;
  height: 4px;
  background: #000000;
  margin-top: 10px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  margin-top: 20px;
}

.info-table th,
.info-table td {
  border: 1px solid #000;
  padding: 10px 12px;
}

.info-table th {
  width: 30%;
  background: #f2f2f2;
  font-weight: 700;
  text-align: right;
}

.form-footer {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}

.stamp-box {
  width: 200px;
  height: 80px;
  border: 1px solid #000;
  text-align: center;
  line-height: 80px;
}
</style>
