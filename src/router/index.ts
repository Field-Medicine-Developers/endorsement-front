import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  // login
  {
    path: "/login",
    component: () => import("../layouts/Auth.vue"),
    meta: { hideFromNav: true, public: true },
    children: [
      {
        path: "",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },

  {
    path: "/injury-support-view/:id",
    name: "InjurySupportView",
    component: () => import("@/views/injuries/InjurySupportView.vue"),
    meta: { public: true, hideFromNav: true },
  },

  {
    path: "/about",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0] },
    children: [
      {
        path: "",
        name: "لوحة",
        component: () => import("@/views/Dashboard/About.vue"),
      },
    ],
  },

  {
    path: "/incoming",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 1] },
    children: [
      {
        path: "",
        name: "الوارد",
        component: () =>
          import("@/views/IncomingWrapper/IncomingWrapper.vue"),
      },
    ],
  },

  {
    path: "/margin-note",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 1] },
    children: [
      {
        path: "",
        name: "الهامش الإداري",
        component: () => import("@/views/Margin/MarginTabs.vue"),
      },
    ],
  },

  {
    path: "/division-flow",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 3] },
    children: [
      {
        path: "",
        name: "هامش مسؤول الشعبة",
        component: () =>
          import("@/views/Divisionfolder/DivisionTabs.vue"),
      },
    ],
  },

  {
    path: "/data-management",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 3] },
    children: [
      {
        path: "",
        name: "شعبة الإدارة",
        component: () =>
          import("@/views/DataManagementModule/DataManagementWrapper.vue"),
      },
    ],
  },

  {
    path: "/flow",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 2] },
    children: [
      {
        path: "",
        name: "البيانات والتدقيق",
        component: () => import("@/views/FlowWrapper/FlowWrapper.vue"),
      },
    ],
  },

  {
    path: "/injury-supports",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0, 4] },
    children: [
      {
        path: "",
        name: "تأييد الإصابة",
        component: () =>
          import("@/views/injuries/InjurySupports.vue"),
      },
    ],
  },

  {
    path: "/contacts",
    component: () => import("@/layouts/Page.vue"),
    meta: { roles: [0] },
    children: [
      {
        path: "",
        name: "إعدادات النظام",
        component: () => import("@/views/Contacts.vue"),
      },
    ],
  },

  // fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//  حماية الصفحات 
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.public) return next();

  if (!token && to.path !== "/login") {
    return next("/login");
  }

  next();
});

