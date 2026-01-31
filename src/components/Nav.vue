<template>
  <div class="containe">
    <nav class="navbar navbar-expand-lg mb-4 shadow-sm bg-white rounded-3 px-3">
      <span
        class="navbar-brand fw-bold d-flex align-items-center gap-2 text-decoration-none me-3 fs-4"
      >
        <span class="brand-title" style="color: #12b1d1">نظام التأييدات</span>
      </span>

      <!-- Mobile / Tablet controls -->
      <div class="d-flex align-items-center gap-2 d-lg-none">
        <!-- زر البروفايل -->
        <div class="profile-btn d-lg-none" @click="toggleProfile">
          <i class="bi bi-person-fill"></i>
        </div>

        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

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
        <div class="profile-wrapper d-none d-lg-flex">
          <div class="profile-btn" ref="profileBtn" @click="toggleProfile">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>
      </div>
    </nav>
    <div
      v-if="showProfile"
      class="profile-card-new floating-profile"
      ref="profileCard"
    >
      <div class="arrow-up"></div>

      <div class="profile-header">
        <div class="avatar">{{ user.fullName.charAt(0) }}</div>
        <div class="name">{{ user.fullName }}</div>
        <div class="username">@{{ user.userName }}</div>
      </div>

      <div class="profile-info">
        <div class="info-row">
          <span class="label">الدور:</span>
          <span class="value">{{ user.departmentName }}</span>
        </div>
      </div>

      <button class="logout-btn-new" @click="logout">
        <i class="bi bi-box-arrow-right me-1"></i>
        تسجيل الخروج
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router";
import { Collapse } from "bootstrap";

const visibleRoutes = computed(() => {
  return routes.filter((r) => {
    // إخفاء الصفحات الخاصة
    if (r.meta?.hideFromNav) return false;

    // لازم يكون Route رئيسي
    if (!r.children || !r.children.length || !r.children[0].name) return false;

    // لو ما محدد roles → متاح للجميع
    if (!r.meta?.roles) return true;

    // فلترة حسب الدور
    return r.meta.roles.includes(user.value.role);
  });
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

let navbarCollapse: Collapse | null = null;

onMounted(() => {
  const raw = localStorage.getItem("userData");
  if (raw) user.value = JSON.parse(raw);

  document.addEventListener("click", handleClickOutside);

  const el = document.getElementById("navbarNavDropdown");
  if (el) {
    navbarCollapse = new Collapse(el, { toggle: false });
  }
});

const toggleNavbar = () => {
  navbarCollapse?.toggle();
};

const closeNavbar = () => {
  navbarCollapse?.hide();
};

router.afterEach(() => {
  if (window.innerWidth < 992) {
    closeNavbar();
  }
});

// عند مغادرة الصفحة
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
