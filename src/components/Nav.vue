<template>
  <div class="containe">
    <nav class="navbar navbar-expand-lg mb-4 shadow-sm bg-white rounded-3 px-3">
      <!-- اللوجو / العنوان -->
      <router-link :to="routes[0].path" 
                   class="navbar-brand fw-bold d-flex align-items-center gap-2 text-decoration-none me-3 fs-4">
        <span style="color:#12b1d1;">نظام التأييدات</span>
      </router-link>

      <!-- زر الموبايل -->
      <button class="navbar-toggler border-0 shadow-none" 
              type="button" 
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown" 
              aria-controls="navbarNavDropdown" 
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- روابط النافبار -->
      <div class="collapse navbar-collapse d-flex align-items-center justify-content-between" id="navbarNavDropdown">
        
        <!--  القسم الأيسر: روابط الصفحات -->
        <ul class="navbar-nav gap-2">
          <li class="nav-item text-uppercase fw-semibold" 
              v-for="route in routes" 
              :key="route.path">
            <router-link 
              :to="route.path" 
              class="nav-link px-3 py-2 rounded-2"
              :title="route.children && route.children.length > 0 ? route.children[0].name : ''"
              :class="{ active: isActive(route.path) }"
            >
              <!-- <i class="bi bi-house-fill me-1" v-if="route.path === `${siteUrl}/home`"></i> -->
              {{ route.children && route.children.length > 0 
                  ? route.children[0].name 
                  : "" }}
            </router-link>
          </li>
        </ul>

        <!--  القسم الأيمن: زر تسجيل الخروج -->
        <button class="btn logout-btn fw-semibold px-3 py-2" @click="logout">
          <i class="bi bi-box-arrow-right" style="font-size: 1.3rem;"></i> 
        </button>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router";

const siteUrl = import.meta.env.VITE_BUILD_ADDRESS;
const router = useRouter();
const activeRoute = computed(() => router.currentRoute.value.path);
const isActive = (path: string) => path === activeRoute.value;

// دالة تسجيل الخروج
const logout = () => {
  localStorage.removeItem("token");
  router.push(`${siteUrl}/login`);
};
</script>

<style lang="scss" scoped>
.navbar {
  border-bottom: 2px solid #12b1d1;
  border-radius: 0% !important;
  background-color: #12b1d10a !important;
  position: relative;
}

/* روابط النافبار */
.nav-link {
  font-size: 1.1rem;
  color: #495057;
  position: relative;
  transition: color 0.25s ease;
  overflow: hidden;
}

.nav-link:hover {
  background-color: #ebf0f6;
  color: #12b1d1;
}

.nav-link.active {
  color: #12b1d1 !important;
  font-weight: 600;
}

.navbar-brand {
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
}

/* خط متحرك تحت الرابط */
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: #12b1d1;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.33, 0.83, 0.99, 0.98);
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

/* زر تسجيل الخروج */
.logout-btn {
  border: 2px solid #e4e8ed;
  color: #1f1c1d;
  background-color: #e4e8ed;
  border-radius: 0.6rem;
  transition: all 0.3s ease;
  margin-inline-start: auto; 
  font-size: 18px;
}

.logout-btn:hover {
  background-color: #5b5959;
  color: #fff;
  box-shadow: 0 4px 12px rgba(171, 169, 169, 0.3);
}






.logout-btn {
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
  border: 2px solid #e4e8ed;
  color: #1f1c1d;
  background-color: #e4e8ed;
  border-radius: 0.6rem;
  transition: all 0.3s ease;
  margin-inline-start: auto; 
  font-size: 18px;
}

/* العنصر الذي يعطي البوردر */
.logout-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(60deg, #a1adad, #e01414, #a1adad, #e01414);
  background-size: 400% 400%;
  border-radius: 12px;
  opacity: 0; /* مخفي بشكل افتراضي */
  transition: opacity 0.3s;
  z-index: 0;
}

/* ظهور البوردر عند التحويم وتحريك الخلفية */
.logout-btn:hover::before {
  opacity: 1;
  animation: rotateBorder 4s linear infinite;
}

/* محتوى الزر فوق البوردر */
.logout-btn > * {
  position: relative;
  z-index: 1;
}

/* حركة الدوران */
@keyframes rotateBorder {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
