<template>
  <div class="containe">
    <nav class="navbar navbar-expand-lg mb-4 shadow-sm bg-white rounded-3 px-3">
      <router-link
        :to="routes[0].path"
        class="navbar-brand fw-bold d-flex align-items-center gap-2 text-decoration-none me-3 fs-4"
      >
        <span class="brand-title" style="color: #12b1d1">نظام التأييدات</span>
      </router-link>

      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse align-items-center justify-content-between"
        id="navbarNavDropdown"
      >
        <ul class="navbar-nav gap-1">
          <li
            class="nav-item text-uppercase fw-semibold"
            v-for="route in visibleRoutes"
            :key="route.path"
          >
            <router-link
              :to="route.path"
              class="nav-link px-3 py-2 rounded-2"
              :title="
                route.children && route.children.length > 0
                  ? route.children[0].name
                  : ''
              "
              :class="{ active: isActive(route.path) }"
            >
              <!-- <i class="bi bi-house-fill me-1" v-if="route.path === `${siteUrl}/home`"></i> -->
              {{
                route.children && route.children.length > 0
                  ? route.children[0].name
                  : ""
              }}
            </router-link>
          </li>
        </ul>

        <!-- زر البروفايل -->
        <div class="profile-wrapper">
          <div class="profile-btn" ref="profileBtn" @click="toggleProfile">
            <i class="bi bi-person-fill"></i>
          </div>

          <div v-if="showProfile" class="profile-card-new" ref="profileCard">
            <div class="arrow-up"></div>

            <div class="profile-header">
              <div class="avatar">{{ user.fullName.charAt(0) }}</div>
              <div class="name">{{ user.fullName }}</div>
              <div class="username">@{{ user.userName }}</div>
            </div>

            <div class="profile-info">
              <div class="info-row">
                <span class="label">القسم:</span>
                <span class="value">{{ user.departmentName }}</span>
              </div>

              <!-- <div class="info-row">
                <span class="label">الدور:</span>
                <span class="value">{{ getRoleName(user.role) }}</span>
              </div> -->
            </div>

            <button class="logout-btn-new" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router";

const visibleRoutes = computed(() => {
  return routes.filter(
    (r) =>
      !r.meta?.hideFromNav && // إخفاء الصفحات الخاصة
      r.children && // فقط الصفحات الرئيسية
      r.children.length > 0 &&
      r.children[0].name // التي لها اسم ظاهر
  );
});

const siteUrl = import.meta.env.VITE_BUILD_ADDRESS;
const router = useRouter();

//Active Path
const activeRoute = computed(() => router.currentRoute.value.path);
const isActive = (path: string) => path === activeRoute.value;

const showProfile = ref(false);

//  DOM
const profileCard = ref<HTMLElement | null>(null);
const profileBtn = ref<HTMLElement | null>(null);

//Profile open/close button
const toggleProfile = () => {
  showProfile.value = !showProfile.value;
};

// Close when you click outside the profile
const handleClickOutside = (e: MouseEvent) => {
  const card = profileCard.value;
  const btn = profileBtn.value;

  if (!showProfile.value) return;

  if (
    card &&
    !card.contains(e.target as Node) &&
    btn &&
    !btn.contains(e.target as Node)
  ) {
    showProfile.value = false;
  }
};

const user = ref({
  fullName: "",
  userName: "",
  departmentName: "",
  role: 0,
});

const getRoleName = (role: number) => {
  switch (role) {
    case 1:
      return "مدخل بيانات";
    case 2:
      return "مدقق";
    case 3:
      return "مدير نظام";
    default:
      return "غير معروف";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  router.push(`${siteUrl}/login`);
};

onMounted(() => {
  const raw = localStorage.getItem("userData");
  if (raw) user.value = JSON.parse(raw);

  document.addEventListener("click", handleClickOutside);
});

// عند مغادرة الصفحة
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.navbar {
  border-bottom: 2px solid #12b1d1;
  border-radius: 6% !important;
  background-color: #12b1d10a !important;
  position: relative;
}

.nav-link {
  font-size: 1rem;
  color: #495057;
  position: relative;
  transition: color 0.25s ease;
  overflow: hidden;
  font-weight: 600;
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

.logout-btn::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(60deg, #a1adad, #e01414, #a1adad, #e01414);
  background-size: 400% 400%;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}

.logout-btn:hover::before {
  opacity: 1;
  animation: rotateBorder 4s linear infinite;
}

.logout-btn > * {
  position: relative;
  z-index: 1;
}

@keyframes rotateBorder {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.profile-wrapper {
  position: relative;
  margin-right: 15px;
}

/*  Profile card */
.profile-card-new {
  position: absolute;
  top: 60px;
  left: 20px;
  width: 240px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 18px;
  border: 1px solid #eaf7fa;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  animation: fadeDrop 0.22s ease-out;
  z-index: 3000;
}

/* السهم */
.arrow-up {
  position: absolute;
  top: -7px;
  left: 30px;
  width: 14px;
  height: 14px;
  background: white;
  border-left: 1px solid #eaf7fa;
  border-top: 1px solid #eaf7fa;
  transform: rotate(45deg);
  border-radius: 3px;
}

.profile-header {
  text-align: center;
  margin-bottom: 15px;
}

.profile-header .avatar {
  width: 60px;
  height: 60px;
  background: #12b1d126;
  color: #12b1d1;
  font-weight: 800;
  font-size: 1.8rem;
  border-radius: 50%;
  margin: 0 auto 8px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-header .name {
  font-size: 1.1rem;
  font-weight: 700;
}

.profile-header .username {
  font-size: 0.82rem;
  color: #777;
}

.profile-info {
  margin: 10px 0 15px 0;
}

.profile-info .info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 0.88rem;
}

.profile-info i {
  color: #12b1d1;
  font-size: 1rem;
}

.label {
  font-weight: 700;
  color: #444;
}

.value {
  margin-right: auto;
  color: #333;
  font-weight: 600;
}

.logout-btn-new {
  width: 100%;
  padding: 9px;
  background: #ffe1e1;
  color: #d9534f;
  border: 1px solid #ffcccc;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: 0.25s ease;
}

.logout-btn-new:hover {
  background: #ffc9c9;
  color: #c9302c;
  box-shadow: 0 4px 10px rgba(217, 83, 79, 0.25);
}

@keyframes fadeDrop {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* زر البروفايل  */
.profile-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #12b1d1, #0b8fad);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #fff;
  cursor: pointer;
  transition: 0.25s ease;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 20px rgba(18, 177, 209, 0.35);
  position: relative;
}

.profile-btn:hover {
  background: linear-gradient(135deg, #15c9ea, #0ba6c9);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(18, 177, 209, 0.45);
}

.profile-btn:active {
  transform: scale(0.92);
}

.profile-btn::after {
  content: "";
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid rgba(18, 177, 209, 0.3);
  animation: pulseBtn 2s infinite ease-out;
}

/* -----------------------------------------------------------
       تنسيق خاص لشاشات iPad Mini و الشاشات المتوسطة
----------------------------------------------------------- */
@media (max-width: 1024px) {
  .navbar {
    padding: 8px 10px !important;
  }

  .navbar-brand {
    font-size: 1.3rem !important;
  }

  .navbar-nav {
    gap: 0.3rem !important;
  }

  .nav-link {
    padding: 6px 10px !important;
    font-size: 0.9rem !important;
  }

  .profile-wrapper {
    margin-right: 5px !important;
  }

  .profile-btn {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
}

/* -----------------------------------------------------------
      تنسيق إضافي لشاشات أصغر (مثل 768px)
----------------------------------------------------------- */
@media (max-width: 768px) {
  .navbar-nav {
    gap: 0.2rem !important;
    flex-wrap: wrap;
  }

  .nav-link {
    font-size: 0.85rem !important;
    padding: 4px 8px !important;
  }

  .navbar-brand {
    font-size: 1.2rem !important;
  }

  .profile-btn {
    width: 38px;
    height: 38px;
  }
}
.brand-title {
  font-family: "Cairo", sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #0fa7c9, #12b1d1, #0fa7c9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(18, 177, 209, 0.25);
  color: #12b1d1;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 6px rgba(18, 177, 209, 0.3);
}
</style>
