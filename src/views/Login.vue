<template>
  <div class="login-page">
    <!-- العنوان -->
    <h1 class="system-title mb-5">نظام التأييدات</h1>

    <!-- الكارد -->
    <div class="card-box">
      <div class="heading">تسجيل الدخول</div>

      <form @submit.prevent="handleLogin" class="form">
        <input
          v-model="form.userName"
          class="input"
          type="text"
          placeholder="اسم المستخدم"
          required
        />

        <input
          v-model="form.password"
          class="input"
          type="password"
          placeholder="كلمة المرور"
          required
        />

        <button class="login-button" type="submit" :disabled="loading">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          <span>{{ loading ? "جاري الدخول..." : "دخول" }}</span>
        </button>
      </form>

      <p v-if="errorMsg" class="text-danger text-center mt-3">{{ errorMsg }}</p>
      <!-- <span class="agreement"><a href="#">لجنة البرمجة والتطوير</a></span> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/auth.service.js";

const router = useRouter();

const form = ref({
  userName: "",
  password: "",
});

const loading = ref(false);
const errorMsg = ref("");

// تسجيل الدخول
const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const res = await login({
      userName: form.value.userName,
      password: form.value.password,
    });

    // قراءة الاستجابة الصحيحة 
    const response = res.data;

    if (!response.success || !response.data || !response.data.token) {
      errorMsg.value = "اسم المستخدم أو كلمة المرور غير صحيحة";
      loading.value = false;
      return;
    }

    // استخراج البيانات من data.data
    const user = response.data;

    // حفظ التوكن
    localStorage.setItem("token", user.token);

    // حفظ بيانات المستخدم
    localStorage.setItem("userData", JSON.stringify(user));

    // تحويل حسب الدور
    const role = Number(user.role);

    if (role === 0)
      router.push(`${import.meta.env.VITE_BUILD_ADDRESS}/incoming`);
    else if (role === 1)
      router.push(`${import.meta.env.VITE_BUILD_ADDRESS}/incoming`);
    else if (role === 2)
      router.push(`${import.meta.env.VITE_BUILD_ADDRESS}/transaction-flow`);
    else if (role === 3)
      router.push(`${import.meta.env.VITE_BUILD_ADDRESS}/margin-note`);
    else router.push(`${import.meta.env.VITE_BUILD_ADDRESS}/home`);
  } catch (err) {
    errorMsg.value = "فشل الاتصال بالخادم، حاول مرة أخرى";
  }

  loading.value = false;
};
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  background-image: url("@/assets/stacked-peaks-haikei.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.system-title {
  position: relative;
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  letter-spacing: 2px;
  padding: 20px 60px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(18, 177, 209, 0.2);
  backdrop-filter: blur(6px);
  animation: fadeInDown 1s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-box {
  max-width: 550px;
  width: 100%;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  padding: 25px 35px;
  border: 3px solid #12b1d1;
  box-shadow: rgba(133, 189, 215, 0.5) 30px 30px 30px -30px;
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 26px;
  color: #ffffff;
  margin-bottom: 3rem;
}

.form .input {
  width: 100%;
  background: #fdfefeae;
  border: 2px solid #d0e8f0;
  padding: 15px 20px;
  border-radius: 12px;
  margin-top: 15px;
  font-size: 1rem;
  text-align: center;
  transition: 0.25s;
}

.form .input:focus {
  outline: none;
  border-color: #12b1d1;
  box-shadow: 0 0 0 4px rgba(18, 177, 209, 0.2);
}

.form .login-button {
  width: 100%;
  font-weight: bold;
  background: linear-gradient(45deg, #1089d3 0%, #12b1d1 100%);
  color: white;
  padding-block: 15px;
  margin: 20px auto;
  border-radius: 20px;
  border: none;
  transition: 0.2s;
  cursor: pointer;
}

.form .login-button:hover {
  transform: scale(1.03);
}

.text-danger {
  color: #ff4949;
  font-size: 14px;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-border {
  color: white !important;
}

</style>
