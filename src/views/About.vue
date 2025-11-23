<template>
  <div class="dashboard container-fluid mt-0">
    <div class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center gap-2">
      <span class="appbar-icon d-inline-flex align-items-center justify-content-center">
        <i class="bi bi-clipboard2-pulse"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">لوحة التحكم</h2>
      </div>
    </div>
  </div>


    <!-- صف الكروت -->
    <div class="icons-box p-4 border rounded-4 d-flex justify-content-around align-items-center flex-wrap">
      <div class="icon-card text-center">
        <i class="bi bi-house-fill"></i>
        <h6>الرئيسية</h6>
        <span>120</span>
      </div>
      <div class="icon-card text-center">
        <i class="bi bi-boxes"></i>
        <h6>المخازن</h6>
        <span>45</span>
      </div>
      <div class="icon-card text-center">
        <i class="bi bi-car-front-fill"></i>
        <h6>السيارات</h6>
        <span>12</span>
      </div>
      <div class="icon-card text-center">
        <i class="bi bi-cart4"></i>
        <h6>المشتريات</h6>
        <span>88</span>
      </div>
      <div class="icon-card text-center">
        <i class="bi bi-cloud-snow"></i>
        <h6>الأرشيف</h6>
        <span>37</span>
      </div>
      <div class="icon-card text-center">
        <i class="bi bi-gear"></i>
        <h6>الإعدادات</h6>
        <span>6</span>
      </div>
    </div>

  <!-- صف الرسم البياني -->
   <div class="charts-box mt-5 p-4 border rounded-4">
     <div class="d-flex align-items-center mb-4">
       <h5 class="fw-bold mb-0">إحصائيات التأييدات</h5>
     </div>
   
     <div class="chart-card p-3 border rounded-3 shadow-sm">
       <canvas id="lineChart"></canvas>
     </div>
   </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Chart from "chart.js/auto";

onMounted(() => {
  const ctx = document.getElementById("lineChart") as HTMLCanvasElement;
  if (ctx) {
    new Chart(document.getElementById("lineChart") as HTMLCanvasElement, {
  type: "line",
  data: {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو"],
    datasets: [{
      label: "عدد التأييدات",
      data: [30, 45, 28, 60, 40],
      borderColor: "#12b1d1",
      backgroundColor: "rgba(18, 177, 209, 0.2)",
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,   
    plugins: {
      legend: {
        labels: {
          font: {
            size: 11,             
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 }     
        }
      },
      y: {
        ticks: {
          font: { size: 10 }     
        }
      }
    }
  }
});

  }
});

</script>

<style scoped>
.icons-box {
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  transition: 0.3s;
  padding: 2rem !important;
}

/* كروت أصغر */
.icon-card {
  flex: 1 1 150px;
  margin: 0.8rem;
  padding: 1.5rem 1rem;
  background: #fdfefe;
  border-radius: 0.8rem;
  border: 2px solid #12b1d1;
  box-shadow: 0 4px 10px rgba(18, 177, 209, 0.15);
  transition: 0.3s;
}

.icon-card:hover {
  transform: translateY(-6px) scale(1.05);
}

.icon-card i {
  font-size: 2.5rem;
  color: #12b1d1;
  margin-bottom: 0.3rem;
}

.icon-card h6 {
  margin: 0.3rem 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.icon-card span {
  font-size: 1rem;
  font-weight: 700;
  color: #12b1d1;
}

/* صندوق الشارت */
.charts-box {
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.charts-box {
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border: 2px solid #12b1d1;
  padding: 1rem;          
}

.chart-card {
  height: 250px;          
}

.chart-card canvas {
  height: 100% !important;
}


/* حركة نزول من الأعلى */
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-card {
  flex: 1 1 150px;
  margin: 0.8rem;
  padding: 1.5rem 1rem;
  background: #fdfefe;
  border-radius: 0.8rem;
  border: 2px solid #12b1d1;
  box-shadow: 0 4px 10px rgba(18, 177, 209, 0.15);
  transition: 0.3s;

  /* 👇 الأنيميشن */
  opacity: 0;
  animation: slideDown 0.8s ease forwards;
}

/* نعمل تأخير بسيط لكل كارد حسب ترتيبه */
.icon-card:nth-child(1) { animation-delay: 0.1s; }
.icon-card:nth-child(2) { animation-delay: 0.2s; }
.icon-card:nth-child(3) { animation-delay: 0.3s; }
.icon-card:nth-child(4) { animation-delay: 0.4s; }
.icon-card:nth-child(5) { animation-delay: 0.5s; }
.icon-card:nth-child(6) { animation-delay: 0.6s; }


.icon-card:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 8px 20px rgba(18, 177, 209, 0.25), inset 0 0 8px rgba(18, 177, 209, 0.08);
}

</style>
