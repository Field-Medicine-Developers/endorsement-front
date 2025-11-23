<template>
  <!-- Top App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-arrow-left-right"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">إجراءات التدقيق</h2>
        <small class="text-muted">استلام وتدقيق معاملات الوارد</small>
      </div>
    </div>

    <button class="btn btn-primary" @click="refresh">تحديث البيانات</button>
  </div>

  <!-- Table Card -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة معاملات التدقيق</h5>
    </div>

    <div class="card-body">
      <div class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الجريح</th>
                <th>رقم الكتاب</th>
                <th>تاريخ الاستلام</th>
                <th>تاريخ التسليم</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(r, i) in flowList" :key="r.id">
                <td>{{ i + 1 }}</td>
                <td>{{ r.injuredName }}</td>
                <td>{{ r.bookNumber }}</td>
                <td>{{ formatDate(r.receiveDate) }}</td>
                <td>{{ formatDate(r.deliveryDate) }}</td>

                <td>
                  <span
                    class="badge rounded-pill"
                    :class="
                      r.status === 'Pending'
                        ? 'bg-warning-subtle text-warning'
                        : 'bg-success-subtle text-success'
                    "
                  >
                    {{
                      r.status === "Pending" ? "قيد التدقيق" : "مُرسل للإدارة"
                    }}
                  </span>
                </td>

                <td>
                  <div class="d-flex gap-2 justify-content-center">
                    <!-- تعديل -->
                    <button class="button-edit" @click="startEdit(r)">
                      <svg viewBox="0 0 512 512" class="svgIcon">
                        <path
                          d="M362.7 19.3c25-25 65.5-25
                              90.5 0l39.5 39.5c25 25 25 65.5
                              0 90.5l-39.5 39.5L323.2
                              58.8l39.5-39.5zm-68 68L58.8
                              323.2 19.3 482.7c-2.9 12.1
                              8.2 23.2 20.3 20.3l159.5-39.5L444.7
                              217.3 294.7 87.3z"
                        />
                      </svg>
                    </button>

                    <!-- إرسال للإدارة -->
                    <button class="button-send" @click="sendToManager(r.id)">
                      <svg class="svgIcon" viewBox="0 0 24 24">
                        <path d="M3 12l18-9-9 18-2-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="flowList.length === 0">
                <td colspan="7" class="py-5">
                  <i class="bi bi-inboxes fs-1 text-muted mb-2"></i>
                  <div class="text-muted">لا توجد بيانات</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" ref="editModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">تعديل بيانات التدقيق</h5>
        </div>

        <form @submit.prevent="saveEdit">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label">تاريخ الاستلام</label>
                <input
                  type="date"
                  v-model="editForm.receiveDate"
                  class="form-control"
                />
              </div>

              <div class="col-6">
                <label class="form-label">تاريخ التسليم</label>
                <input
                  type="date"
                  v-model="editForm.deliveryDate"
                  class="form-control"
                />
              </div>

              <div class="col-12">
                <label class="form-label">ملاحظات</label>
                <textarea
                  v-model="editForm.notes"
                  rows="3"
                  class="form-control"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light" type="button" @click="closeEdit">
              إلغاء
            </button>
            <button class="btn btn-add" type="submit">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

interface FlowRecord {
  id: string;
  injuredName: string;
  bookNumber: string;
  receiveDate: string | null;
  deliveryDate: string | null;
  notes: string | null;
  status: "Pending" | "Sent";
}

const flowList = ref<FlowRecord[]>([
  {
    id: crypto.randomUUID(),
    injuredName: "حسين القحطاني",
    bookNumber: "1234",
    receiveDate: "2025-11-20",
    deliveryDate: null,
    notes: "",
    status: "Pending",
  },
  {
    id: crypto.randomUUID(),
    injuredName: "فاطمة السيد",
    bookNumber: "5432",
    receiveDate: "2025-11-18",
    deliveryDate: "2025-11-19",
    notes: "",
    status: "Sent",
  },
]);

// modal
const editModalEl = ref<HTMLElement | null>(null);
let editModal: Modal | null = null;

// Form
const editForm = reactive<FlowRecord>({
  id: "",
  injuredName: "",
  bookNumber: "",
  receiveDate: null,
  deliveryDate: null,
  notes: "",
  status: "Pending",
});

const startEdit = (rec: FlowRecord) => (
  Object.assign(editForm, rec), editModal?.show()
);

const closeEdit = () => editModal?.hide();

const saveEdit = () => (
  (flowList.value = flowList.value.map((x) =>
    x.id === editForm.id ? { ...editForm } : x
  )),
  closeEdit()
);

const sendToManager = (id: string) =>
  (flowList.value = flowList.value.map((x) =>
    x.id === id ? { ...x, status: "Sent" } : x
  ));

const refresh = () => (flowList.value = [...flowList.value]);

const formatDate = (d: string | null) =>
  d ? new Intl.DateTimeFormat("en-EG").format(new Date(d)) : "-";

onMounted(() => {
  editModal = new Modal(editModalEl.value as HTMLElement);
});
</script>
