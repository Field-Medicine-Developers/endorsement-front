<template>
  <!-- Top App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-diagram-3"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">الشُعَب</h2>
        <small class="text-muted">إدارة شُعَب النظام</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="openAdd">إضافة شعبة</button>
  </div>

  <!-- Search -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.name"
          class="form-control"
          placeholder="بحث بالاسم"
        />
      </div>
      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load">بحث</button>
        <button class="btn-advanced" @click="resetFilters()">
          أعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الشُعَب</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="spinner-wrapper">
        <div class="spinner"></div>
      </div>

      <div v-else class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table text-center align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الشعبة</th>
                <th>الوصف</th>
                <th>عدد المستخدمين</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(d, i) in list" :key="d.id">
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>{{ d.name }}</td>
                <td>{{ d.description }}</td>
                <td>{{ d.usersCount }}</td>
                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <button class="button-edit" @click="openEdit(d)">
                      <svg viewBox="0 0 512 512" class="svgIcon">
                        <path
                          d="M362.7 19.3c25-25 65.5-25
                          90.5 0l39.5 39.5c25 25 25
                          65.5 0 90.5l-39.5 39.5L323.2
                          58.8l39.5-39.5zm-68 68L58.8
                          323.2 19.3 482.7c-2.9 12.1
                          8.2 23.2 20.3 20.3l159.5-39.5L444.7
                          217.3 294.7 87.3z"
                        />
                      </svg>
                    </button>

                    <button class="button" @click="remove(d.id)">
                      <svg viewBox="0 0 448 512" class="svgIcon">
                        <path
                          d="M135.2 17.7L128 32H32C14.3
                          32 0 46.3 0 64s14.3 32 
                          32 32h384c17.7 0 32-14.3 
                          32-32s-14.3-32-32-32H320l-7.2-14.3C307.4
                          6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2
                          6.8-28.6 17.7zM416 
                          128H32l21.2 339c1.6 25.3 
                          22.6 45 47.9 45h246c25.3 
                          0 46.3-19.7 47.9-45L416 128z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="5" class="py-5 text-muted">لا توجد بيانات</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- Pagination -->
  <nav class="circle-pagination d-flex justify-content-center mt-4">
    <button
      class="page-btn"
      :disabled="page === 1"
      @click="changePage(page - 1)"
    >
      <i class="bi bi-chevron-right"></i>
    </button>

    <button
      v-for="p in visiblePages"
      :key="p"
      class="page-number"
      :class="{ active: p === page }"
      @click="changePage(p)"
    >
      {{ p }}
    </button>

    <button
      class="page-btn"
      :disabled="page === totalPages"
      @click="changePage(page + 1)"
    >
      <i class="bi bi-chevron-left"></i>
    </button>
  </nav>

  <!-- Modal -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content glass-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل شعبة" : "إضافة شعبة" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <label class="form-label">اسم الشعبة</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              required
            />

            <label class="form-label mt-3">الوصف</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="form-control"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              إلغاء
            </button>
            <button class="btn btn-add">
              {{ editMode ? "حفظ" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";

import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departments.service.js";

import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";

const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const list = ref([]);
const loading = ref(false);

const filters = reactive({
  name: "",
});

const modalEl = ref(null);
let modal = null;

const editMode = ref(false);

const form = reactive({
  id: "",
  name: "",
  description: "",
});

const load = async () => {
  loading.value = true;

  try {
    const res = await getDepartments({
      pageNumber: page.value,
      pageSize,
      name: filters.name || null,
    });

    list.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages;
  } catch (err) {
    errorAlert("فشل في جلب الأقسام");
  } finally {
    loading.value = false;
  }
};

const visiblePages = computed(() => {
  const arr = [];
  let start = page.value - 1;

  if (start < 1) start = 1;

  let end = start + 2;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - 2);
  }

  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
});

const openAdd = () => ((editMode.value = false), reset(), modal.show());

const openEdit = (d) => (
  (editMode.value = true), Object.assign(form, d), modal.show()
);

const save = async () => {
  try {
    if (!form.name.trim()) return errorAlert("الاسم مطلوب");

    if (!editMode.value) {
      await addDepartment(form);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateDepartment(form.id, form);
      successAlert("تم تعديل القسم");
    }

    modal.hide();
    load();
  } catch (err) {
    errorAlert("حدث خطأ أثناء الحفظ");
  }
};

const resetFilters = () => {
  filters.name = "";
  load();
};

const reset = () => ((form.id = ""), (form.name = ""), (form.description = ""));

const remove = async (id) => {
  const res = await confirmDelete();
  if (!res.isConfirmed) return;

  try {
    await deleteDepartment(id);
    successAlert("تم حذف القسم");
    load();
  } catch {
    errorAlert("فشل حذف القسم");
  }
};

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  load();
};

const close = () => modal.hide();

onMounted(() => {
  modal = new Modal(modalEl.value);
  load();
});
</script>
