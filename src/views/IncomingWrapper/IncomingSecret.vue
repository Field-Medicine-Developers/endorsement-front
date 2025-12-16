<template>
  <!-- Top App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-inbox"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">الوارد السري</h2>
        <small class="text-muted">عرض وإدارة معاملات الوارد</small>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button type="button" class="btn btn-primary" @click="openAdd()">
        إضافة وارد جديد
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث بالاسم..."
          @keyup.enter="load"
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load()">بحث</button>
        <button class="btn-advanced" @click="openAdvanced()">بحث متقدم</button>
        <button class="btn-advanced" @click="resetFilters()">
          أعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الوارد</h5>
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
                <th>اسم الجريح</th>
                <th>التشكيل</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>هامش مدير القسم</th>
                <th>هامش مسوؤل الشعبة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(inc, idx) in incomingList" :key="inc.id">
                <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
                <td>
                  <div v-for="(name, i) in inc.injuredNames" :key="i">
                    • {{ name }}
                  </div>
                </td>
                <td>{{ inc.formationName }}</td>
                <td>{{ inc.incomingBookNumber }}</td>
                <td>{{ formatDate(inc.incomingDate) }}</td>
                <td>{{ inc.managerNote || "—" }}</td>  
                <td>{{ inc.managerNoteDivision || "—" }}</td>  

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button class="button-edit" @click="openEdit(inc)">
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

                    <!-- حذف -->
                    <button class="button" @click="remove(inc.id)">
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
                    <!-- ترحيل -->
                    <button class="button-transfer" @click="openTransfer(inc)">
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M492.7 273.4L400 366.1c-15 15-41 4.5-41-17V320H208c-22.1 
                             0-40-17.9-40-40v-48c0-22.1 17.9-40 40-40h151V162c0-21.5 
                             26-32 41-17l92.7 92.7c9.4 9.4 9.4 24.6 0 
                             34.1zM20 238.6l92.7-92.7c15-15 41-4.5 41 17v42h151c22.1 
                             0 40 17.9 40 40v48c0 22.1-17.9 40-40 40H153v29.1c0 21.5-26 
                             32-41 17L20 273.4c-9.4-9.4-9.4-24.6 0-34.1z"
                        />
                      </svg>
                    </button>

                    <button class="button-view" @click="openView(inc)">
                      <svg class="svgIcon" viewBox="0 0 576 512">
                        <path
                          d="M572.52 241.4C518.29 135.59 407.81 64 288 
                              64S57.71 135.59 3.48 241.4a48.07 48.07 
                              0 000 45.2C57.71 376.41 168.19 448 288 
                              448s230.29-71.59 284.52-161.4a48.07 48.07 
                              0 000-45.2zM288 400c-88.22 0-168.48-48.33-211.86-128C119.52 
                              192.33 199.78 144 288 144s168.48 48.33 
                              211.86 128C456.48 351.67 376.22 400 288 
                              400zm0-208a80 80 0 1080 80 80.09 80.09 
                              0 00-80-80z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="incomingList.length === 0">
                <td colspan="7" class="py-5 text-muted">
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

  <!-- Modal (Add/Edit) -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? "تعديل وارد" : "إضافة وارد" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">أسماء الجرحى</label>

                <div class="tag-box">
                  <div class="tags">
                    <span
                      v-for="(name, i) in form.injuredNames"
                      :key="i"
                      class="tag"
                    >
                      {{ name }}
                      <span class="remove" @click="removeTag(i)">×</span>
                    </span>

                    <input
                      ref="inputRef"
                      v-model="tempName"
                      @keydown.enter.stop.prevent="manualAddTag"
                      class="tag-input-field"
                      placeholder="اكتب اسم الجريح..."
                    />
                  </div>

                  <button
                    type="button"
                    class="tag-add-btn"
                    @click="manualAddTag"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">التشكيل</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.formationId"
                    :options="formations"
                    label="name"
                    :reduce="(f) => f.id"
                    searchable
                    placeholder="اختر التشكيل..."
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">رقم الوارد</label>
                <input
                  v-model="form.incomingBookNumber"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ الوارد</label>
                <input
                  v-model="form.incomingDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-6">
                <label class="form-label">الموضوع</label>
                <input v-model="form.subject" class="form-control" />
              </div>
              <div class="col-6">
                <label class="form-label">المحتوى</label>
                <input v-model="form.content" rows="3" class="form-control" />
              </div>
              <!-- <div class="col-6">
                  <label class="form-label">هامش مدير القسم</label>
                  <input v-model="form.content" rows="3" class="form-control" />
                </div> -->
              <div class="col-md-6">
                <label class="form-label">ارسال الى :</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.departmentIds"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    multiple
                    searchable
                    placeholder="اختر الوحدة..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close()">
              إلغاء
            </button>
            <button type="submit" class="btn btn-add" @click.stop>
              {{ editMode ? "حفظ التعديل" : "إضافة" }}
            </button>
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
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">الموضوع</label>
              <input v-model="filters.subject" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">التشكيل</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="filters.formationId"
                  :options="formations"
                  label="name"
                  :reduce="(f) => f.id"
                  searchable
                  placeholder="اختر التشكيل..."
                />
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">المصدر</label>
              <input v-model="filters.source" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">من تاريخ الوارد</label>
              <input
                v-model="filters.incomingDateFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ الوارد</label>
              <input
                v-model="filters.incomingDateTo"
                type="date"
                class="form-control"
              />
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

  <!-- Transfer Modal -->
  <div class="modal fade" ref="transferModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">ترحيل المعاملة</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">الوحدة</label>
              <div class="custom-vue-select-container">
                <VueSelect
                  v-model="transfer.departmentId"
                  :options="departments"
                  label="name"
                  :reduce="(d) => d.id"
                  placeholder="اختر الوحدة..."
                  searchable
                />
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">إرفاق ملفات</label>
              <input
                type="file"
                multiple
                @change="handleFiles"
                class="form-control"
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">ملاحظات</label>
              <textarea
                v-model="transfer.notes"
                rows="3"
                class="form-control"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeTransfer()">إلغاء</button>
          <button class="btn btn-add" @click="submitTransfer()">تحويل</button>
        </div>
      </div>
    </div>
  </div>

  <!-- View Modal -->
  <div class="modal fade" ref="viewModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">عرض تفاصيل الوارد</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">أسماء الجرحى</label>

              <div class="badges-box">
                <span
                  v-for="(name, i) in view.injuredNames"
                  :key="i"
                  class="badge-tag"
                >
                  {{ name }}
                </span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">التشكيل</label>
              <input
                class="form-control"
                :value="view.formationName"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">رقم الوارد</label>
              <input
                class="form-control"
                :value="view.incomingBookNumber"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الوارد</label>
              <input
                class="form-control"
                :value="formatDate(view.incomingDate)"
                disabled
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">الموضوع</label>
              <input class="form-control" :value="view.subject" disabled />
            </div>

            <div class="col-md-12">
              <label class="form-label">المحتوى</label>
              <textarea
                class="form-control"
                rows="3"
                :value="view.content"
                disabled
              ></textarea>
            </div>

            <div class="col-md-12">
              <label class="form-label">الوحدة</label>

              <div class="badges-box">
                <span
                  v-for="(dep, i) in view.departmentNames"
                  :key="i"
                  class="badge-tag"
                >
                  {{ dep }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeView()">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { Modal } from "bootstrap";
import { computed } from "vue";
import VueSelect from "vue3-select";
import { useRouter } from "vue-router";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";
import { getDepartments } from "@/services/departments.service.js";
import { getFormations } from "@/services/formations.service.js";
import {
  getIncomings,
  addIncoming,
  updateIncoming,
  deleteIncoming,
  transferIncoming,
} from "@/services/incoming.service.js";

const router = useRouter();
/* Pagination */
const visiblePages = computed(() => {
  const pages = [];
  let start = page.value - 1;
  if (start < 1) start = 1;
  let end = start + 2;
  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(1, end - 2);
  }
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const formations = ref([]);
const incomingList = ref([]);
const loading = ref(false);

const page = ref(1);
const totalPages = ref(1);
const pageSize = 10;

/* Filters */
const filters = reactive({
  injuredName: "",
  subject: "",
});

/* Reset Filters */
const resetFilters = () => {
  filters.name = "";
  filters.id = "";
  filters.injuredName = "";
  filters.formationId = null;
  filters.formationName = "";
  filters.subject = "";
  filters.content = "";
  filters.incomingDate = "";
  filters.incomingBookNumber = "";
  filters.source = "";
  load();
};

const tempName = ref("");
const inputRef = ref(null);

const addTag = (newTag) => {
  newTag = newTag.trim();
  if (!newTag) return;

  form.injuredNames.push(newTag);
};

const manualAddTag = async () => {
  console.log("ENTER PRESSED:", tempName.value);
  if (!tempName.value.trim()) return;

  addTag(tempName.value);

  tempName.value = "";

  await nextTick();
  inputRef.value?.focus(); // يرجع الفوكس للحقل
};

const removeTag = (index) => {
  form.injuredNames.splice(index, 1);
};

/* Load Data */
const load = async () => {
  loading.value = true;

  try {
    const res = await getIncomings({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      subject: filters.subject || null,
      formationId: filters.formationId || null,
      source: filters.source || null,
      incomingDateFrom: filters.incomingDateFrom || null,
      incomingDateTo: filters.incomingDateTo || null,
      createdByUserId: filters.createdByUserId || null,
    });

    incomingList.value = res.data.data;
    totalPages.value = res.data.pagination.totalPages;
  } finally {
    loading.value = false;
  }
};

/* Advanced Search Modal */
const advancedModal = ref(null);
let modalAdv = null;

const openAdvanced = () => modalAdv.show();
const closeAdvanced = () => modalAdv.hide();

const applyAdvanced = () => {
  modalAdv.hide();
  page.value = 1;
  load();
};

/* Load Departments */
const departments = ref([]);

const loadDepartments = async () => {
  try {
    const res = await getDepartments({
      pageNumber: 1,
      pageSize: 100,
    });
    departments.value = res.data.data;
  } catch {
    console.log("فشل تحميل الأقسام");
  }
};

/* Load Formations */
const loadFormations = async () => {
  try {
    const res = await getFormations({
      pageNumber: 1,
      pageSize: 200,
    });
    formations.value = res.data.data;
  } catch (e) {
    console.log("فشل تحميل التشكيلات");
    formations.value = [];
  }
};

/* Add/Edit Modal */
const modalEl = ref(null);
let modal = null;
const editMode = ref(false);

const form = reactive({
  id: "",
  injuredNames: [],
  formationId: null,
  incomingBookNumber: "",
  incomingDate: "",
  subject: "",
  content: "",
  departmentIds: [],
});

const openAdd = () => ((editMode.value = false), reset(), modal.show());

const openEdit = (item) => {
  editMode.value = true;
  form.id = item.id;
  form.injuredNames = item.injuredNames || [];
  form.formationId = item.formationId;
  form.incomingBookNumber = item.incomingBookNumber;
  form.incomingDate = item.incomingDate;
  form.subject = item.subject;
  form.content = item.content;
  form.departmentIds = item.departmentIds || [];

  modal.show();
};

const save = async () => {
  try {
    if (!editMode.value) {
      await addIncoming(form);
      successAlert(" تمت الإضافة بنجاح");
    } else {
      await updateIncoming(form.id, form);
      successAlert(" تم التعديل بنجاح");
    }

    modal.hide();
    load();
  } catch (e) {
    console.error("خطأ بالحفظ", e);
    errorAlert(" فشل الحفظ");
  }
};

const remove = async (id) => {
  const result = await confirmDelete("هل أنت متأكد من الحذف؟");
  if (!result.isConfirmed) return;
  try {
    await deleteIncoming(id);
    successAlert(" تم الحذف بنجاح");
    load();
  } catch (e) {
    console.error(e);
    errorAlert(" حدث خطأ أثناء الحذف");
  }
};

const changePage = (p) => ((page.value = p), load());

/* Reset Form */
const reset = () => {
  form.id = "";
  form.injuredNames = [];
  tempName.value = "";
  form.formationId = null;
  form.subject = "";
  form.content = "";
  form.incomingDate = "";
  form.incomingBookNumber = "";
  form.departmentIds = [];
  tempName.value = "";
};

const close = () => modal.hide();

/* Date Formatting */
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const transferModal = ref(null);
let modalTransfer = null;

const transfer = reactive({
  incomingId: "",
  departmentId: null,
  notes: "",
  files: [],
});

const openTransfer = (inc) => {
  transfer.incomingId = inc.id;
  transfer.departmentId = null;
  transfer.notes = "";
  transfer.files = [];
  modalTransfer.show();
};

const closeTransfer = () => modalTransfer.hide();

const handleFiles = (e) => {
  transfer.files = Array.from(e.target.files);
};

const submitTransfer = async () => {
  try {
    if (!transfer.incomingId || !transfer.departmentId) {
      errorAlert("يرجى اختيار الشعبة المراد الترحيل إليها.");
      return;
    }

    const fd = new FormData();

    fd.append("IncomingId", transfer.incomingId);
    fd.append("DepartmentId", transfer.departmentId);

    if (transfer.notes) {
      fd.append("Notes", transfer.notes);
    }

    if (transfer.files.length > 0) {
      transfer.files.forEach((f) => fd.append("files", f));
    }

    // Debug (اختياري)
    for (let pair of fd.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    await transferIncoming(fd);

    successAlert("تم ترحيل المعاملة بنجاح");

    modalTransfer.hide();
    load();
  } catch (e) {
    console.log("خطأ في الترحيل", e);
    errorAlert("حدث خطأ أثناء الترحيل");
  }
};

/* VIEW MODAL */
const viewModal = ref(null);
let modalView = null;

const view = reactive({
  id: "",
  injuredName: "",
  formationName: "",
  incomingBookNumber: "",
  incomingDate: "",
  subject: "",
  content: "",
  departmentNames: [],
});

const openView = (inc) => {
  view.id = inc.id;
  view.injuredNames = inc.injuredNames || [];
  view.formationName = inc.formationName;
  view.incomingBookNumber = inc.incomingBookNumber;
  view.incomingDate = inc.incomingDate;
  view.subject = inc.subject;
  view.content = inc.content;
  view.departmentNames = inc.departmentNames || [];

  modalView.show();
};

const closeView = () => modalView.hide();

/* Init */
onMounted(() => {
  modal = new Modal(modalEl.value);
  modalAdv = new Modal(advancedModal.value);
  modalTransfer = new Modal(transferModal.value);
  modalView = new Modal(viewModal.value);
  load();
  loadDepartments();
  loadFormations();
});
</script>
