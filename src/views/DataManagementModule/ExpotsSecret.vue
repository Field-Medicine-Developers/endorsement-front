<template>
    <!-- App Bar -->
    <div
      class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
    >
      <div class="d-flex align-items-center gap-2">
        <span
          class="appbar-icon d-inline-flex align-items-center justify-content-center"
        >
          <i class="bi bi-send"></i>
        </span>
        <div>
          <h2 class="h5 fw-bold m-2"> الصادر السري</h2>
          <small class="text-muted">إدارة معاملات الصادر السري</small>
        </div>
      </div>
  
      <button class="btn btn-primary" @click="openAdd">إضافة صادر جديد</button>
    </div>
  
    <!-- Table -->
    <!-- Table -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header custom-card-header">
        <h5 class="mb-0 fw-bold primary">وارد شعبة الإدارة</h5>
      </div>
  
      <div class="card-body">
        <div v-if="loading" class="spinner-wrapper">
          <div class="spinner"></div>
        </div>
  
        <div v-else class="card inner-card">
          <div class="table-responsive">
            <table class="table custom-table align-middle text-center mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>رقم الصادر</th>
                  <th>تاريخ الصادر</th>
                  <th>الجهة المرسل إليها</th>
                  <th>الموضوع</th>
                  <th v-role="[0]" class="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in list" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.exportNumber }}</td>
                  <td>{{ formatDate(item.exportDate) }}</td>
                  <td>{{ item.destinationDepartment }}</td>
                  <td>{{ item.subject }}</td>
                  <td>
                    <div class="d-flex justify-content-center gap-2">
                      <!-- تعديل -->
                      <button
                        v-role="[0]"
                        class="button-edit"
                        @click="openEdit(item)"
                      >
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
                      <button
                        v-role="[0]"
                        class="button"
                        @click="remove(item.id)"
                      >
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
                <tr v-if="list.length === 0">
                  <td colspan="6" class="py-4 text-muted">
                    <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                    لا توجد بيانات
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Modal -->
    <div class="modal fade" tabindex="-1" ref="modalEl">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "تعديل صادر" : "إضافة صادر جديد" }}
            </h5>
          </div>
  
          <!-- Body -->
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">رقم الصادر</label>
                <input v-model="form.exportNumber" class="form-control" />
              </div>
  
              <div class="col-md-6">
                <label class="form-label">تاريخ الصادر</label>
                <input
                  type="date"
                  v-model="form.exportDate"
                  class="form-control"
                />
              </div>
  
              <div class="col-md-12">
                <label class="form-label">الجهة المرسل إليها</label>
                <input
                  v-model="form.destinationDepartment"
                  class="form-control"
                />
              </div>
  
              <div class="col-md-12">
                <label class="form-label">الموضوع</label>
                <input v-model="form.subject" class="form-control" />
              </div>
  
              <div class="col-md-12">
                <label class="form-label">المحتوى</label>
                <textarea
                  v-model="form.content"
                  rows="4"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModal">
              إلغاء
            </button>
  
            <button
              class="btn btn-primary"
              :disabled="isSaving"
              @click="save"
              :class="{ 'btn-saving': isSaving }"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديل" : "إضافة" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import * as bootstrap from "bootstrap";
  import {
    getExports,
    createExport,
    updateExport,
    deleteExport,
  } from "@/services/exports.service";
  import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
  const list = ref([]);
  const loading = ref(false);
  const isEdit = ref(false);
  const currentId = ref(null);
  const isSaving = ref(false);
  
  const form = ref({
    exportNumber: "",
    exportDate: "",
    destinationDepartment: "",
    subject: "",
    content: "",
  });
  
  // ====== Modal ======
  const modalEl = ref(null);
  let modalInstance = null;
  
  onMounted(() => {
    modalInstance = new bootstrap.Modal(modalEl.value, {
      backdrop: "static",
      keyboard: false,
    });
    load();
  });
  
  // ====== Load ======
  const load = async () => {
    loading.value = true;
    const res = await getExports({ pageNumber: 1, pageSize: 10 });
    list.value = res.data.data ?? [];
    loading.value = false;
  };
  
  // ====== Add ======
  const openAdd = () => {
    isEdit.value = false;
    currentId.value = null;
    resetForm();
    modalInstance.show();
  };
  
  // ====== Edit ======
  const openEdit = (item) => {
    isEdit.value = true;
    currentId.value = item.id;
    form.value = {
      exportNumber: item.exportNumber,
      exportDate: item.exportDate?.substring(0, 10),
      destinationDepartment: item.destinationDepartment,
      subject: item.subject,
      content: item.content ?? "",
    };
    modalInstance.show();
  };
  
  // ====== Close ======
  const closeModal = () => {
    modalInstance.hide();
  };
  
  // ====== Save ======
  const save = async () => {
    if (isSaving.value) return;
  
    isSaving.value = true;
  
    try {
      if (isEdit.value) {
        await updateExport(currentId.value, form.value);
        successAlert("تم التعديل بنجاح");
      } else {
        await createExport(form.value);
        successAlert("تمت الإضافة بنجاح");
      }
  
      modalInstance.hide();
      await load();
    } catch (e) {
      errorAlert("فشلت العملية، حاول مرة أخرى");
      console.error(e);
    } finally {
      isSaving.value = false;
    }
  };
  
  // ====== Delete ======
  const remove = async (id) => {
    const result = await confirmDelete();
  
    if (!result.isConfirmed) return;
  
    try {
      await deleteExport(id);
      successAlert("تم الحذف بنجاح");
      await load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  };
  
  // ====== Helpers ======
  const resetForm = () => {
    form.value = {
      exportNumber: "",
      exportDate: "",
      destinationDepartment: "",
      subject: "",
      content: "",
    };
  };
  
  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "-";
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };
  </script>
  
  <style scoped>
  .modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .modal-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    width: 600px;
    max-width: 95%;
  }
  </style>
  