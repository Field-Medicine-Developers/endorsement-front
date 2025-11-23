<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-people-fill"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">إدارة الحسابات</h2>
        <small class="text-muted">إضافة وتعديل وحذف الحسابات</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="openAdd()">إضافة مستخدم</button>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <!-- <label class="form-label mb-1">بحث بالاسم</label> -->
        <input
          v-model="filters.fullName"
          class="form-control"
          placeholder="ابحث باسم المستخدم..."
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="loadUsers()">بحث</button>

        <button class="btn-advanced" @click="openAdvanced()">بحث متقدم</button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الحسابات</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border"></div>
      </div>

      <div v-else class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم الكامل</th>
                <th>اسم المستخدم</th>
                <th>الدور</th>
                <th>الشعبة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(u, i) in users" :key="u.id">
                <td>{{ i + 1 }}</td>
                <td>{{ u.fullName }}</td>
                <td>{{ u.userName }}</td>
                <td>{{ roleName(u.role) }}</td>
                <td>{{ u.departmentName }}</td>

                <td>
                   <div class="d-flex justify-content-center gap-2">
                    <button class="button-edit" @click="openEdit(u)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M290.74 93.24l-197.5 197.5c-2.5 2.5-4.1 
                          5.7-4.6 9.1l-12 84c-1.1 7.5 5.3 13.9 
                          12.8 12.8l84-12c3.4-.5 6.6-2.1 
                          9.1-4.6l197.5-197.5-89.3-89.3z 
                          M497.9 56.69l-42.6-42.6c-18.7-18.7-49.1-18.7-67.9 
                          0l-39.1 39.1 89.3 89.3 39.1-39.1c18.8-18.7 
                          18.8-49.1 0-67.9z"
                        />
                      </svg>
                    </button>

                    <button class="button" @click="removeUser(u.id)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M135.2 17.7L128 32H32c-17.7 0-32 14.3-32 32s14.3 32 
                           32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 
                           6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 
                           128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h246c25.3 
                           0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="users.length === 0">
                <td colspan="6" class="py-5 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد حسابات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Modal -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? "تعديل مستخدم" : "إضافة مستخدم" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <label class="form-label">الاسم الكامل</label>
            <input v-model="form.fullName" class="form-control" required />

            <label class="form-label mt-3">اسم المستخدم</label>
            <input v-model="form.userName" class="form-control" required />

            <label class="form-label mt-3">كلمة السر</label>
            <input
              v-model="form.password"
              type="password"
              :required="!isEdit"
              class="form-control"
            />

            <label class="form-label mt-3">الدور</label>
            <div class="custom-vue-select-container">
              <VueSelect
                v-model="form.role"
                :options="roleOptions"
                label="label"
                :reduce="(r) => r.value"
                searchable
                placeholder="اختر الدور..."
              />
            </div>

            <label class="form-label mt-3">الشعبة</label>

            <div class="custom-vue-select-container">
              <VueSelect
                v-model="form.departmentId"
                :options="departments"
                label="name"
                :reduce="(d) => d.id"
                searchable
                placeholder="اختر الشعبة..."
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" @click="close()">إلغاء</button>
            <button class="btn btn-add">{{ isEdit ? "حفظ" : "إضافة" }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advancedModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">اسم المستخدم</label>
              <input v-model="filters.userName" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">الدور</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.role"
                  :options="[{ value: null, label: 'الكل' }, ...roleOptions]"
                  label="label"
                  :reduce="(r) => r.value"
                  searchable
                  placeholder="اختر الدور..."
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">الشعبة</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.departmentId"
                  :options="departments"
                  label="name"
                  :reduce="(d) => d.id"
                  searchable
                  placeholder="اختر الشعبة..."
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">الحالة</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.isActive"
                  :options="[
                    { value: null, label: 'الكل' },
                    { value: true, label: 'فعال' },
                    { value: false, label: 'غير فعال' },
                  ]"
                  label="label"
                  :reduce="(s) => s.value"
                  searchable
                  placeholder="اختر الحالة..."
                />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">تطبيق</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";

import { getUsers, addUser, deleteUser } from "@/services/users.service.js";
import { getDepartments } from "@/services/departments.service.js";

/* خيارات الدور */
const roleOptions = [
  { value: 0, label: "Admin" },
  { value: 1, label: "مدخل البيانات" },
  { value: 2, label: "حفظ وطباعة وإرسال" },
  { value: 3, label: "كتابة هامش الإدارة" },
];

const roleName = (r) => roleOptions.find((x) => x.value === r)?.label;

/* بيانات */
const users = ref([]);
const formations = ref([]);
const loading = ref(false);

/* المودلات */
const modalEl = ref(null);
const advancedModal = ref(null);
let modal = null;
let modalAdv = null;

/* فورم المستخدم */
const isEdit = ref(false);

const form = reactive({
  id: "",
  fullName: "",
  userName: "",
  password: "",
  role: 1,
  departmentId: null,
});

/* الفلاتر */
const filters = reactive({
  fullName: "",
  userName: "",
  role: null,
  departmentId: null,
  isActive: null,
});

/* قائمة الشعب */
const departments = ref([]);

/* تحميل الشعب */
const loadDepartments = async () => {
  try {
    const res = await getDepartments({
      pageNumber: 1,
      pageSize: 100,
    });

    departments.value = res.data.data;
  } catch {
    departments.value = [];
  }
};

/* تحميل الحسابات */
const loadUsers = async () => {
  loading.value = true;

  const res = await getUsers({
    pageNumber: 1,
    pageSize: 50,
    fullName: filters.fullName || null,
    userName: filters.userName || null,
    role: filters.role ?? null,
    departmentId: filters.departmentId || null,
    isActive: filters.isActive ?? null,
  });

  users.value = res.data.data || [];
  loading.value = false;
};

/* فتح/إغلاق مودلات */
const openAdd = () => {
  isEdit.value = false;
  resetForm();
  modal.show();
};

const openEdit = (u) => {
  isEdit.value = true;
  Object.assign(form, u);
  form.password = "";
  modal.show();
};

const close = () => modal.hide();

const openAdvanced = () => modalAdv.show();
const closeAdvanced = () => modalAdv.hide();

const applyAdvanced = () => {
  modalAdv.hide();
  loadUsers();
};

/* حذف مستخدم */
const removeUser = async (id) => {
  await deleteUser(id);
  loadUsers();
};

/* حفظ */
const save = async () => {
  if (!isEdit.value) {
    await addUser(form);
  }
  modal.hide();
  loadUsers();
};

/* Reset Form */
const resetForm = () => {
  form.id = "";
  form.fullName = "";
  form.userName = "";
  form.password = "";
  form.role = 1;
  form.departmentId = null;
};

onMounted(() => {
  modal = new Modal(modalEl.value);
  modalAdv = new Modal(advancedModal.value);

  loadUsers();
  loadDepartments();
});
</script>
