<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-receipt"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">إضافات الهامش</h2>
        <small class="text-muted">إضافة هوامش - ترحيل</small>
      </div>
    </div>
    <div class="d-flex gap-2">
      <!-- Bulk Transfer Button -->
      <button
        type="button"
        class="btn btn-primary"
        :disabled="selectedDepartmentIds.length === 0"
        @click="openBulkTransfer"
      >
        ترحيل المحدد ({{ selectedDepartmentIds.length }})
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <!-- بحث بالاسم -->
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder=" بحث بالاسم..."
          @keyup.enter="load"
        />
      </div>

      <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
        <button class="btn-search" @click="load()">بحث</button>

        <button class="btn-advanced" @click="openAdvanced()">بحث متقدم</button>

        <button class="btn-advanced" @click="resetFilters()">
          إعادة تعيين
        </button>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card shadow-sm border-0 mb-4">
    <div class="card-header custom-card-header">
      <h5 class="mb-0 fw-bold primary">قائمة الإضافات</h5>
    </div>

    <div class="card-body">
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
      </div>

      <div class="card inner-card">
        <div class="table-responsive">
          <table class="table custom-table align-middle text-center mb-0">
            <thead>
              <tr>
                <th>
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                    />
                    <span></span>
                  </label>
                </th>
                <th>#</th>
                <th>تاريح استلام المعاملة</th>
                <th>أسماء الجرحى</th>
                <th>القيادة / التشكيل</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>عدد الكتاب</th>
                <th>تاريخ الكتاب</th>
                <th>هامش مدير القسم</th>
                <!-- <th>هامش مسوؤل شعبة</th> -->
                <!-- <th>تاريخ هامش المسؤول</th> -->
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(m, i) in list" :key="m.id">
                <td>
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      :value="m.id"
                      v-model="selectedDepartmentIds"
                    />
                    <span></span>
                  </label>
                </td>
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>{{ formatDate(m.createdAt) }}</td>
                <td>
                  <div>
                    <div>{{ m.injuredNames?.[0] }}</div>
                    <div
                      v-if="m.injuredNames && m.injuredNames.length > 1"
                      class="show-more"
                      @click="openNamesModal(m.injuredNames)"
                    >
                      عرض الكل ({{ m.injuredNames.length }})
                    </div>
                  </div>
                </td>

                <td>
                  <div class="fw-bold">{{ m.command.name || "—" }}</div>
                  <small class="text-muted"> {{ m.formation.name }}</small>
                </td>

                <td>{{ m.incomingBookNumber }}</td>
                <td>{{ formatDate(m.incomingDate) }}</td>
                <td>{{ m.bookCount }}</td>
                <td>{{ formatDate(m.bookDate) }}</td>
                <td>
                  <button
                    class="btn btn-search"
                    @click="openManagerNotes(m.managerNotes || [])"
                  >
                    عرض الهوامش ({{ m.managerNotes?.length || 0 }})
                  </button>
                </td>

                <!-- <td>{{ m.managerNoteDivision || "—" }}</td> -->
                <!-- <td>{{ formatDate(m.noteDate) }}</td> -->
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- زر إضافة هامش -->
                    <button class="button-add" @click="openAdd(m.incomingId)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M432 256c0 17.7-14.3 32-32 32h-128v128c0 17.7-14.3 32-32 
                          32s-32-14.3-32-32V288H80c-17.7 0-32-14.3-32-32s14.3-32 
                          32-32h128V96c0-17.7 14.3-32 32-32s32 14.3 
                          32 32v128h128c17.7 0 32 14.3 32 32z"
                        />
                      </svg>
                    </button>
                    <!-- تعديل -->
                    <button
                      v-role="[0, 1]"
                      class="button-edit"
                      @click="openEdit(m)"
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

                    <!-- حذف -->
                    <button v-role="[0]" class="button" @click="remove(m.id)">
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

                    <button class="button-transfer" @click="openTransfer(m)">
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

                    <button class="button-view" @click="openIncomingDetails(m)">
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

              <tr v-if="list.length === 0">
                <td colspan="12" class="py-4 text-muted">
                  <i class="bi bi-inboxes fs-1 d-block mb-2"></i>
                  لا توجد بيانات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <nav
        ref="paginationRef"
        class="circle-pagination d-flex justify-content-center mt-4"
      >
        <button
          type="button"
          class="page-btn"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >
          <i class="bi bi-chevron-right"></i>
        </button>

        <button
          type="button"
          class="page-number"
          v-for="p in visiblePages"
          :key="p"
          :class="{ active: p === page }"
          @click="changePage(p)"
        >
          {{ p }}
        </button>

        <button
          type="button"
          class="page-btn"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      </nav>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" ref="modalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            {{ editMode ? "تعديل معلومات" : "إضافة معلومات" }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-4">
              <div
                v-for="(note, index) in form.managerNotes"
                :key="index"
                class="col-12"
              >
                <div class="note-card">
                  <div class="note-header">
                    <span class="note-badge">#{{ index + 1 }}</span>
                    <span class="note-title">هامش مدير القسم</span>

                    <button
                      v-if="form.managerNotes.length > 1"
                      type="button"
                      class="btn-remove"
                      @click="removeManagerNote(index)"
                      title="حذف الهامش"
                    >
                      ✕
                    </button>
                  </div>

                  <div class="row g-3 mt-2">
                    <div class="col-12">
                      <input
                        v-model="note.managerNote"
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="اكتب الهامش هنا..."
                        required
                      />
                    </div>

                    <div class="col-12">
                      <label class="form-label small text-muted">
                        تاريخ الهامش
                      </label>
                      <input
                        v-model="note.noteDate"
                        type="date"
                        class="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- زر إضافة -->
              <div class="col-12">
                <button
                  type="button"
                  class="btn-add-note"
                  @click="addManagerNote"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  إضافة هامش جديد
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="handleClose">
              إلغاء
            </button>

            <button class="btn btn-primary px-4" :disabled="isSaving">
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{
                isSaving
                  ? "جارٍ الحفظ..."
                  : editMode
                  ? "حفظ التعديلات"
                  : "حفظ الهوامش"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Transfer Modal -->
  <div class="modal fade" tabindex="-1" ref="transferModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">تحويل إلى قسم آخر</h5>
        </div>

        <form @submit.prevent="transfer">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">إرسال إلى الوحدة:</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="transferForm.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    searchable
                    placeholder="اختر القسم..."
                  />
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">ملاحظات</label>
                <textarea
                  v-model="transferForm.notes"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <!-- <div class="col-md-12">
                <label class="form-label">المرفقات</label>
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="form-control"
                  multiple
                />
              </div> -->
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="closeTransfer()"
            >
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :disabled="transferLoading"
              :class="{ 'btn-saving': transferLoading }"
              @click.prevent="transfer"
            >
              <span
                v-if="transferLoading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ transferLoading ? "جارٍ التحويل..." : "تحويل" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Bulk Transfer Modal -->
  <div class="modal fade" tabindex="-1" ref="bulkTransferModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">ترحيل المحدد إلى قسم</h5>
        </div>

        <form @submit.prevent="bulkTransfer">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">إرسال إلى الوحدة:</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="bulkTransferForm.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    searchable
                    placeholder="اختر القسم..."
                  />
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">ملاحظات</label>
                <textarea
                  v-model="bulkTransfer.notes"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="closeBulkTransfer()"
            >
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :disabled="bulkTransferLoading"
              :class="{ 'btn-saving': bulkTransferLoading }"
              @click.prevent="bulkTransfer"
            >
              <span
                v-if="bulkTransferLoading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ bulkTransferLoading ? "جارٍ الترحيل..." : "ترحيل" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advancedModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- <div class="col-12">
              <label class="form-label">اسم الجريح</label>
              <input v-model="filters.injuredName" class="form-control" />
            </div> -->

            <div class="col-12">
              <label class="form-label"> هامش المدير</label>
              <input v-model="filters.managerNote" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">عدد الكتاب</label>
              <input v-model="filters.bookCount" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">من تاريخ</label>
              <input
                v-model="filters.createdAtFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-12">
              <label class="form-label">إلى تاريخ</label>
              <input
                v-model="filters.createdAtTo"
                type="date"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">بحث</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Names Modal – عرض كل أسماء الجرحى -->
  <div class="modal fade" tabindex="-1" ref="namesModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">أسماء الجرحى</h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(name, i) in allNames"
            :key="i"
            class="name-item border-bottom py-2"
          >
            • {{ name }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeNamesModal()">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal – عرض الهوامش -->
  <div class="modal fade" ref="managerNotesModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content notes-modal">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">هوامش مدير القسم</h5>
        </div>

        <div class="modal-body">
          <div v-if="selectedManagerNotes.length" class="notes-list">
            <div
              v-for="(s, i) in selectedManagerNotes"
              :key="i"
              class="border-bottom py-3"
            >
              <div class="fw-bold mb-1">{{ i + 1 }}. هامش مدير القسم</div>

              <div class="text-muted small mb-2">
                {{ formatDate(s.noteDate) }}
              </div>
              <div class="note-box">
                {{ s.managerNote || "—" }}
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="bi bi-inbox fs-1 mb-2"></i>
            <p class="text-muted mb-0">لا توجد هوامش مسجلة</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeManagerNotes">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal – تفاصيل الوارد -->
  <div class="modal fade" tabindex="-1" ref="incomingDetailsModalEl">
    <div
      class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
    >
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">تفاصيل الوارد</h5>
          <!-- <button
            type="button"
            class="btn-close"
            @click="closeIncomingDetails"
          ></button> -->
        </div>

        <!-- Body -->
        <div class="modal-body" v-if="selectedIncoming">
          <div class="row g-3">
            <!-- رقم الوارد -->
            <div class="col-md-6">
              <label class="form-label">رقم الوارد</label>
              <input
                class="form-control"
                :value="selectedIncoming.incomingBookNumber ?? '—'"
                disabled
              />
            </div>

            <!-- تاريخ الوارد -->
            <div class="col-md-6">
              <label class="form-label">تاريخ الوارد</label>
              <input
                class="form-control"
                :value="formatDate(selectedIncoming.incomingDate)"
                disabled
              />
            </div>

            <!-- تاريخ الاستلام -->
            <div class="col-md-6">
              <label class="form-label">تاريخ الاستلام</label>
              <input
                class="form-control"
                :value="formatDate(selectedIncoming.receiveDate)"
                disabled
              />
            </div>

            <!-- الحالة -->
            <div class="col-md-6">
              <label class="form-label">الحالة</label>
              <input
                class="form-control"
                :value="selectedIncoming.status === 1 ? 'فعال' : '—'"
                disabled
              />
            </div>

            <!-- أسماء الجرحى -->
            <div class="col-md-12">
              <label class="form-label">أسماء الجرحى</label>
              <input
                class="form-control"
                :value="selectedIncoming.injuredNames?.join('، ') || '—'"
                disabled
              />
            </div>

            <!-- القيادة -->
            <div class="col-md-6">
              <label class="form-label">القيادة</label>
              <input
                class="form-control"
                :value="selectedIncoming.command?.name || '—'"
                disabled
              />
            </div>

            <!-- التشكيل -->
            <div class="col-md-6">
              <label class="form-label">التشكيل</label>
              <input
                class="form-control"
                :value="selectedIncoming.formation?.name || '—'"
                disabled
              />
            </div>

            <!-- أنشئ بواسطة -->
            <div class="col-md-6">
              <label class="form-label">أنشئ بواسطة</label>
              <input
                class="form-control"
                :value="selectedIncoming.createdByUserName || '—'"
                disabled
              />
            </div>

            <!-- تاريخ الإنشاء -->
            <div class="col-md-6">
              <label class="form-label">تاريخ الإنشاء</label>
              <input
                class="form-control"
                :value="formatDate(selectedIncoming.createdAt)"
                disabled
              />
            </div>

            <!-- الهوامش -->
            <div class="col-md-12">
              <label class="form-label">
                الهوامش ({{ selectedIncoming.managerNotes?.length || 0 }})
              </label>

              <textarea
                class="form-control"
                rows="4"
                disabled
                :value="
                  selectedIncoming.managerNotes?.length
                    ? selectedIncoming.managerNotes
                        .map((n, i) => `${i + 1}- ${n.managerNote}`)
                        .join('\n')
                    : 'لا توجد هوامش'
                "
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="closeIncomingDetails"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useRoute, useRouter } from "vue-router";
import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";
import { nextTick } from "vue";
import {
  getMarginNotes,
  addMarginNote,
  updateMarginNote,
  deleteMarginNote,
  transferMarginNote,
} from "@/services/margin-note.service.js";
import {
  successAlert,
  errorAlert,
  confirmDelete,
  confirmAction,
} from "@/utils/alert.js";
import { getDepartments } from "@/services/departments.service.js";

const route = useRoute();

// Values ​​from the inbox page
const incomingId = ref(route.query.incomingId || null);
const departmentId = route.query.departmentId;

// ===== Table data =====
const list = ref([]);
const loading = ref(false);

// ===== Pagination =====
const page = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const visiblePages = ref([1]);

// ===== Departments =====
const departments = ref([]);

// ===== Selection state for bulk operations =====
const selectedDepartmentIds = ref([]);
const selectAll = ref(false);

// ===== Transfer Form =====
const transferForm = reactive({
  marginNoteId: "",
  departmentId: "",
  notes: "",
  files: [],
});

// ===== Bulk Transfer Form =====
const bulkTransferForm = reactive({
  departmentId: "",
  notes: "",
});

// ===== Bulk Transfer Loading =====
const bulkTransferLoading = ref(false);

// ===== Download data =====
const load = async () => {
  loading.value = true;

  try {
    const res = await getMarginNotes({
      pageNumber: page.value,
      pageSize: pageSize.value,
      incomingId: incomingId.value || null,
      injuredName: filters.injuredName || null,
      managerNote: filters.managerNote || null,
      bookCount:
        filters.bookCount !== "" && filters.bookCount !== null
          ? Number(filters.bookCount)
          : null,

      createdAtFrom: filters.createdAtFrom || null,
      createdAtTo: filters.createdAtTo || null,
    });

    list.value = res.data.data.map((item) => {
      // console.log("Incoming ID:", item.incomingId);
      // console.log("Manager Notes:", item.managerNotes);
      // console.log("Incoming Data Full:", item);

      return {
        ...item,
        managerNotes: item.managerNotes || [],
      };
    });

    totalPages.value = res.data.pagination.totalPages;
    buildVisiblePages();
    // Reset selections when data is reloaded
    selectedDepartmentIds.value = [];
    selectAll.value = false;
  } finally {
    loading.value = false;
  }
};

const changePage = async (p) => {
  if (p < 1 || p > totalPages.value) return;

  page.value = p;

  await load(); // انتظر التحميل يخلص
  await focusPagination(); // رجع التركيز للباجنيشن
};

const paginationRef = ref(null);

const focusPagination = async () => {
  await nextTick();
  paginationRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const buildVisiblePages = () => {
  const total = totalPages.value;
  const current = page.value;
  const range = 2; // عدد الصفحات يمين ويسار
  const start = Math.max(1, current - range);
  const end = Math.min(total, current + range);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  visiblePages.value = pages;
};

// ===== Download departments =====
const loadDepartments = async () => {
  try {
    const res = await getDepartments({ pageNumber: 1, pageSize: 100 });
    departments.value = res.data.data.filter(
      (dept) => dept.id !== departmentId
    );
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

// ===== modal =====
const modalEl = ref(null);
const transferModalEl = ref(null);
const bulkTransferModalEl = ref(null);
let modal = null;
let transferModal = null;
let bulkTransferModal = null;
let advancedModal = null;
const advancedModalEl = ref(null);
const editMode = ref(false);

const form = reactive({
  id: "",
  incomingId,
  managerNotes: [
    {
      managerNote: "",
      noteDate: "",
    },
  ],
});

const resetForm = () => {
  form.id = "";
  form.managerNotes = [
    {
      managerNote: "",
      noteDate: "",
    },
  ];
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedDepartmentIds.value = list.value.map((item) => item.id);
  } else {
    selectedDepartmentIds.value = [];
  }
};

const handleClose = () => {
  resetForm();
  modal.hide();
};

const openAdd = (incomingIdFromRow) => {
  incomingId.value = incomingIdFromRow;
  editMode.value = false;
  resetForm();
  modal.show();
};

const openEdit = (row) => {
  editMode.value = true;
  resetForm();
  form.managerNotes = row.managerNotes?.length
    ? row.managerNotes.map((n) => ({
        managerNote: n.managerNote,
        noteDate: n.noteDate?.substring(0, 10) || "",
      }))
    : [{ managerNote: "", noteDate: "" }];

  modal.show();
};

const isSaving = ref(false);

const save = async () => {
  if (isSaving.value) return;

  if (!incomingId.value) {
    errorAlert("بيانات الوارد غير موجودة");
    return;
  }
  const managerNotesPayload = form.managerNotes
    .filter((n) => n.managerNote?.trim() && n.noteDate)
    .map((n) => ({
      managerNote: n.managerNote.trim(),
      noteDate: new Date(n.noteDate).toISOString(),
    }));

  if (!managerNotesPayload.length) {
    errorAlert("يرجى إدخال هامش مدير القسم");
    return;
  }

  const data = {
    incomingId: incomingId.value,
    managerNotes: managerNotesPayload,
  };

  isSaving.value = true;

  try {
    await addMarginNote(data);
    successAlert("تمت إضافة الهوامش بنجاح");
    modal.hide();
    load();
  } catch (error) {
    console.error(error);
    errorAlert("فشل الحفظ");
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await deleteMarginNote(id);
      successAlert("تم الحذف بنجاح");
      load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  }
};

const addManagerNote = () => {
  form.managerNotes.push({
    managerNote: "",
    noteDate: "",
  });
};

const removeManagerNote = (index) => {
  form.managerNotes.splice(index, 1);
};

// ===== Transfer Functions =====
const openTransfer = (row) => {
  transferForm.marginNoteId = row.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferForm.files = [];
  transferModal.show();
};

const transferLoading = ref(false);

const transfer = async () => {
  if (transferLoading.value) return;

  if (!transferForm.marginNoteId || !transferForm.departmentId) {
    errorAlert("يرجى اختيار الجهة المراد التحويل إليها");
    return;
  }

  transferLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("MarginNoteId", transferForm.marginNoteId);
    formData.append("DepartmentId", transferForm.departmentId);
    formData.append("Notes", transferForm.notes || "");

    if (transferForm.files?.length) {
      transferForm.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    await transferMarginNote(formData);

    successAlert("تم التحويل بنجاح");
    transferModal.hide();
    load();
  } catch (error) {
    console.error("Error transferring margin note:", error);
    errorAlert(" تم إرسال المعاملة إلى هذا القسم مسبقاً  ");
  } finally {
    transferLoading.value = false;
  }
};

// ===== Bulk Transfer Functions =====
const openBulkTransfer = async () => {
  if (selectedDepartmentIds.value.length === 0) {
    errorAlert("لم يتم تحديد أي عناصر");
    return;
  }

  const confirm = await confirmAction(
    "تأكيد الترحيل",
    `هل تريد ترحيل (${selectedDepartmentIds.value.length}) عناصر إلى القسم المحدد؟`
  );

  if (!confirm.isConfirmed) return;

  bulkTransferForm.departmentId = "";
  bulkTransferForm.notes = "";
  bulkTransferModal.show();
};

const bulkTransfer = async () => {
  if (bulkTransferLoading.value) return;

  if (!bulkTransferForm.departmentId) {
    errorAlert("يرجى اختيار القسم");
    return;
  }

  bulkTransferLoading.value = true;

  try {
    // Process each selected item individually using the existing transfer function
    const successfulTransfers = [];
    const failedTransfers = [];

    for (const noteId of selectedDepartmentIds.value) {
      try {
        const formData = new FormData();
        formData.append("MarginNoteId", noteId);
        formData.append("DepartmentId", bulkTransferForm.departmentId);
        formData.append("Notes", bulkTransferForm.notes || "");

        await transferMarginNote(formData);
        successfulTransfers.push(noteId);
      } catch (error) {
        console.error(`Error transferring margin note ${noteId}:`, error);
        failedTransfers.push({ id: noteId, error: error.message });
      }
    }

    if (failedTransfers.length > 0) {
      console.warn(
        `Successfully transferred ${successfulTransfers.length} items, ${failedTransfers.length} failed`
      );
      if (successfulTransfers.length > 0) {
        successAlert(
          `تم ترحيل ${successfulTransfers.length} عناصر بنجاح مع فشل ${failedTransfers.length} عناصر`
        );
      } else {
        errorAlert(`فشل ترحيل جميع العناصر (${failedTransfers.length})`);
      }
    } else {
      successAlert("تم ترحيل العناصر المحددة بنجاح");
    }

    bulkTransferModal.hide();
    selectedDepartmentIds.value = [];
    selectAll.value = false;
    load();
  } catch (error) {
    console.error("Unexpected error in bulk transfer:", error);
    errorAlert("فشل الترحيل");
  } finally {
    bulkTransferLoading.value = false;
  }
};

const closeBulkTransfer = () => {
  bulkTransferForm.departmentId = "";
  bulkTransferForm.notes = "";
  bulkTransferModal.hide();
};

const openAdvanced = () => {
  advancedModal.show();
};

const closeAdvanced = () => {
  advancedModal.hide();
};

const applyAdvanced = () => {
  advancedModal.hide();
  load();
};

const filters = reactive({
  injuredName: "",
  managerNote: "",
  bookCount: "",
  createdAtFrom: "",
  createdAtTo: "",
});

const resetFilters = () => {
  filters.injuredName = "";
  filters.managerNote = "";
  filters.bookCount = "";
  filters.createdAtFrom = "";
  filters.createdAtTo = "";
  load();
};

const closeTransfer = () => transferModal.hide();

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "-";
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

//  Modal عرض جميع أسماء الجرحى
const allNames = ref([]);
const namesModalEl = ref(null);
let namesModal = null;

const openNamesModal = (names) => {
  allNames.value = names;
  namesModal.show();
};

const closeNamesModal = () => {
  namesModal.hide();
};

const selectedManagerNotes = ref([]);
const managerNotesModalEl = ref(null);
let managerNotesModal = null;

const openManagerNotes = (notes) => {
  selectedManagerNotes.value = notes;
  managerNotesModal.show();
};

const closeManagerNotes = () => {
  managerNotesModal.hide();
};

const selectedIncoming = ref(null);

const openIncomingDetails = (row) => {
  selectedIncoming.value = row;
  incomingDetailsModal.show();
};

const closeIncomingDetails = () => {
  incomingDetailsModal.hide();
};
const incomingDetailsModalEl = ref(null);
let incomingDetailsModal = null;

// ===== INIT =====
onMounted(() => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  bulkTransferModal = new Modal(bulkTransferModalEl.value);
  advancedModal = new Modal(advancedModalEl.value);
  namesModal = new Modal(namesModalEl.value);
  managerNotesModal = new Modal(managerNotesModalEl.value);
  incomingDetailsModal = new Modal(incomingDetailsModalEl.value);
  modalEl.value.addEventListener("hidden.bs.modal", () => {
    resetForm();
  });
  load();
  loadDepartments();
});
</script>

<style>
.note-card {
  background: #f9fbfc;
  border: 1px solid #e5eaf0;
  border-radius: 14px;
  padding: 16px;
  transition: box-shadow 0.2s ease;
}

.note-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.note-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.note-badge {
  background: #12b1d1;
  color: #fff;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 50px;
}

.note-title {
  font-weight: 600;
  color: #12b1d1;
  flex-grow: 1;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #dc3545;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-remove:hover {
  color: #a71d2a;
}

.btn-add-note {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed #12b1d1;
  background: transparent;
  color: #12b1d1;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-add-note:hover {
  background: #12b1d1;
  color: #fff;
}

.modal-footer {
  border-top: 1px solid #eee;
}

.notes-modal {
  border-radius: 16px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.note-item {
  display: flex;
  gap: 14px;
  background: #f9fbfc;
  border: 1px solid #e5eaf0;
  border-radius: 14px;
  padding: 14px;
  transition: box-shadow 0.2s ease;
}

.note-item:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.note-index {
  min-width: 36px;
  height: 36px;
  background: #12b1d1;
  color: #fff;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-content {
  flex: 1;
}

.note-title {
  font-weight: 600;
  color: #12b1d1;
  margin-bottom: 6px;
}

.note-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.note-date {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #6c757d;
}

.empty-state {
  text-align: center;
  padding: 40px 10px;
}
</style>
