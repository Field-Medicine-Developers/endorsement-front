import { createRouter, createWebHistory } from "vue-router";

const baseUrl = import.meta.env.VITE_BUILD_ADDRESS;

export const routes = [
  // صفحة تسجيل الدخول
  {
    path: `${baseUrl}/login`,
    component: () => import("../layouts/Auth.vue")
    , //  هذا الملف اللي أنشأناه
    children: [
      {
        path: "",
        // name: "تسجيل الدخول",
        component: () => import("@/views/Login.vue"), 
      }
    ],
  },

  // الصفحة الرئيسية
  // {
  //   path: `${baseUrl}/home`,
  //   component: () => import("@/layouts/Default.vue"),
  //   children: [
  //     { path: "", name: "الرئيسية", component: () => import("@/views/Home.vue") }
  //   ],
  // },

  {
    path: `${baseUrl}/about`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "لوحة ", component: () => import("@/views/About.vue") }
    ],
  },
  // {
  //   path: `${baseUrl}/contacts`,
  //   component: () => import("@/layouts/Page.vue"),
  //   children: [
  //     { path: "", name: "التواصل", component: () => import("@/views/Contacts.vue") },
  //   ],
  // },

  {
    path: `${baseUrl}/incoming`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "الوارد", component: () => import("@/views/Incoming.vue") },
    ],
  },
  // {
  //   path: `${baseUrl}/flow`,
  //   component: () => import("@/layouts/Page.vue"),
  //   children: [
  //     {
  //       path: "",
  //       name: "التدقيق",
  //       component: () => import("@/views/Flow.vue"),
  //     },
  //   ],
  // },
  {
    path: `${baseUrl}/margin-note`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "الهامش الإداري", component: () => import("@/views/MarginNote.vue") },
    ],
  },
 
  {
    path: `${baseUrl}/injury-supports`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "تأييد الإصابة",
        component: () => import("@/views/InjurySupports.vue"),
      },
    ],
  },
  
  {
    path: `${baseUrl}/departments`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "الشُعَب", component: () => import("@/views/Departments.vue") }
    ],
  },

  {
    path: `${baseUrl}/formations`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      {
        path: "",
        name: "التشكيلات",
        component: () => import("@/views/Formations.vue")
      }
    ],
  },
  {
    path: `${baseUrl}/users`,
    component: () => import("@/layouts/Page.vue"),
    children: [
      { path: "", name: "الحسابات", component: () => import("@/views/Users.vue") }
    ],
  },
  
  // أي مسار غير معروف → login
  {
    path: `${baseUrl}/:pathMatch(.*)*`,
    redirect: `${baseUrl}/login`,
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

//  حماية الصفحات (اختياري)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token"); // أو تحقق من API
  if (!isAuthenticated && to.path !== `${baseUrl}/login`) {
    next(`${baseUrl}/login`);
  } else {
    next();
  }
});
