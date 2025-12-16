<template>
    <div class="notfound-wrapper">
      <div class="glass-card">
        <div class="icon-box">
          <i class="bi bi-compass"></i>
        </div>
  
        <h1 class="code">404</h1>
        <h2 class="title">عذراً! الصفحة غير موجودة</h2>
  
        <p class="desc">
          يبدو أنك وصلت إلى مسار غير صحيح أو أن الصفحة قد تم نقلها أو حذفها.
        </p>
  
        <div class="actions">
          <button class="btn-outline" @click="goBack">
            <i class="bi bi-arrow-right-circle"></i>
            رجوع
          </button>
  
          <router-link to="/login" class="btn-main">
            <i class="bi bi-box-arrow-in-left"></i>
            تسجيل الدخول
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const goBack = () => router.back();
  </script>
  
  <style scoped>
  .notfound-wrapper {
    min-height: 100vh;
    background:
      radial-gradient(circle at top, #dff4fa, transparent),
      linear-gradient(135deg, #f6fbfd, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Cairo", sans-serif;
    padding: 1rem;
  }
  
  .glass-card {
    backdrop-filter: blur(14px);
    background: rgba(255, 255, 255, 0.75);
    border-radius: 24px;
    padding: 3.5rem 3rem;
    text-align: center;
    box-shadow:
      0 30px 60px rgba(18, 177, 209, 0.25);
    max-width: 660px;
    width: 100%;
  }
  
  .icon-box {
    width: 70px;
    height: 70px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #12b1d1, #5be4ff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    box-shadow: 0 10px 25px rgba(18, 177, 209, 0.4);
  }
  
  .code {
    font-size: 5.5rem;
    font-weight: 900;
    margin: 0.5rem 0 0;
    color: #12b1d1;
  }
  
  .title {
    font-size: 1.4rem;
    font-weight: 800;
    margin: 0.5rem 0;
    color: #1f2937;
  }
  
  .desc {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.8;
    margin-bottom: 2rem;
  }
  
  .actions {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-main,
  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .btn-main {
    background: linear-gradient(135deg, #12b1d1, #0ea5c6);
    color: white;
    box-shadow: 0 10px 25px rgba(18, 177, 209, 0.35);
  }
  
  .btn-main:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(18, 177, 209, 0.45);
  }
  
  .btn-outline {
    background: transparent;
    border: 2px solid #12b1d1;
    color: #12b1d1;
  }
  
  .btn-outline:hover {
    background: #12b1d1;
    color: white;
  }
  </style>
  