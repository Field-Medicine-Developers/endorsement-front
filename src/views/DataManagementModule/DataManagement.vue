<template>
  <!-- App Bar -->
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-folder2-open"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">الإدارة</h2>
        <small class="text-muted"
          >إدارة المذكرات – الأرقام والتواريخ والأصل</small
        >
      </div>
    </div>
    <!-- Bulk Transfer Button -->
    <div class="d-flex gap-2">
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
      <div class="col-md-6">
        <!-- <label class="form-label">اسم الجريح</label> -->
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث عن اسم الجريح"
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
                <th>أسماء الجرحى</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>رقم الكتاب</th>
                <th>تاريخ الكتاب</th>
                <!-- <th>تاريخ الإدخال</th> -->
                <th>حالة المعاملة</th>
                <th>هامش مسؤول الشعبة</th>
                <th>هامش المدير القسم</th>
                <!-- <th>تاريخ الاستلام</th> -->
                <!-- <th>سبب الرفض</th> -->
                <!-- <th>تاريخ الرفض</th> -->
                <th>رقم المذكرة</th>
                <th>تاريخ المذكرة</th>
                <th>نوع الصادر</th>
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
                <!-- رقم تسلسلي -->
                <td>{{ (page - 1) * pageSize + i + 1 }}</td>
                <td>
                  <div class="injured-cell">
                    <div class="injured-main">
                      {{ m.injuredNames?.[0] || "—" }}
                    </div>

                    <div
                      v-if="m.injuredNames && m.injuredNames.length > 1"
                      class="show-more"
                      @click="openNamesModal(m.injuredNames)"
                    >
                      عرض الكل ({{ m.injuredNames.length }})
                    </div>
                  </div>
                </td>

                <!-- incoming -->
                <td>{{ m.incomingBookNumber ?? "-" }}</td>
                <td>{{ formatDate(m.incomingDate) }}</td>
                <td>{{ m.bookCount ?? "-" }}</td>
                <td>{{ formatDate(m.bookDate) }}</td>
                <!-- createdAt -->
                <!-- <td>{{ formatDate(m.createdAt) }}</td> -->
                <td>
                  <span v-if="m.status === 0" class="badge bg-secondary">
                    <i class="bi bi-hourglass-split"></i> قيد الانتظار
                  </span>

                  <span v-else-if="m.status === 1" class="badge bg-success">
                    <i class="bi bi-check-circle-fill"></i> مقبول
                  </span>

                  <span v-else-if="m.status === 2" class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i> مرفوض
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openDivisionNoteModal(m.marginNoteDivision)"
                  >
                    عرض الهامش شعبة ({{ m.marginNoteDivision ? 1 : 0 }})
                  </button>
                </td>
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openManagerNotes(m.managerNotes || [])"
                  >
                    عرض الهوامش ({{ m.managerNotes?.length || 0 }})
                  </button>
                </td>

                <!-- تواريخ إضافية -->
                <!-- <td>{{ formatDate(m.receiveDate) }}</td> -->
                <!-- <td>{{ m.rejectionReason ?? "-" }}</td> -->
                <!-- <td>{{ formatDate(m.rejectionDate) }}</td> -->

                <!-- memo -->
                <td>{{ m.memoNumber }}</td>
                <td>{{ formatDate(m.memoDate) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-secondary': m.isExport === 0,
                      'bg-primary': m.isExport === 1,
                      'bg-warning text-dark': m.isExport === 2,
                    }"
                  >
                    {{
                      m.isExport === 0
                        ? "لا يوجد"
                        : m.isExport === 1
                        ? "داخلي"
                        : m.isExport === 2
                        ? "خارجي"
                        : "غير معروف"
                    }}
                  </span>
                </td>

                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- زر إضافة هامش -->
                    <button class="button-add" @click="openAdd(m.marginNoteId)">
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
                      v-role="[0, 3]"
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

                    <button class="button-view" @click="openView(m)">
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

                    <button
                      class="button-archive"
                      title="عرض المرفقات"
                      @click="openArchive(m)"
                    >
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M424.4 214.7L253.1 386c-35.2 35.2-92.3 35.2-127.5 0
                             s-35.2-92.3 0-127.5L300.3 83.9c23.4-23.4 61.4-23.4
                             84.9 0s23.4 61.4 0 84.9L224.6 329.4c-11.7 11.7-30.7
                             11.7-42.4 0s-11.7-30.7 0-42.4L318.1 151c6.2-6.2
                             6.2-16.4 0-22.6s-16.4-6.2-22.6 0L159.6 264.3"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="14" class="py-4 text-muted">
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
      class="page-number"
      v-for="p in visiblePages"
      :key="p"
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

  <!-- Add/Edit Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            {{ editMode ? "تعديل بيانات " : "إضافة بيانات " }}
          </h5>
        </div>

        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">رقم المذكرة</label>
                <input
                  v-model="form.memoNumber"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ المذكرة</label>
                <input
                  v-model="form.memoDate"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">نوع الصادر</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.isExport"
                    :options="exportTypeOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    placeholder="اختر نوع الصادر"
                    class="vue-select"
                  />
                </div>
              </div>

              <!-- <div class="col-md-6">
                <label class="form-label">هل يوجد ملف أصل؟</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.hasOriginalFile"
                    :options="[
                      { label: 'نعم', value: true },
                      { label: 'لا', value: false },
                    ]"
                    label="label"
                    :reduce="(opt) => opt.value"
                    searchable
                    placeholder="اختر..."
                  />
                </div>
              </div> -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close()">
              إلغاء
            </button>
            <button
              type="submit"
              class="btn btn-add"
              :class="{ 'btn-saving': isSaving }"
              :disabled="isSaving"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{
                isSaving ? "جارٍ الحفظ..." : editMode ? "حفظ التعديل" : "إضافة"
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
                <label class="form-label">القسم</label>

                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="transferForm.departmentId"
                    :options="departments"
                    label="name"
                    :reduce="(d) => d.id"
                    searchable
                    placeholder="اختر القسم..."
                    required
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
              type="button"
              class="btn btn-add"
              :class="{ 'btn-saving': transferLoading }"
              :disabled="transferLoading"
              @click="transfer"
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

  <!-- View Modal -->
  <div class="modal fade" tabindex="-1" ref="viewModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">عرض تفاصيل بيانات الإدارة</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- ===== بيانات المذكرة ===== -->
            <div class="col-md-6">
              <label class="form-label">رقم المذكرة</label>
              <div class="form-control">
                {{ viewItem.memoNumber || "—" }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ المذكرة</label>
              <div class="form-control">
                {{ formatDate(viewItem.memoDate) }}
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label">نوع الصادر</label>
              <div class="form-control">
                {{
                  viewItem.isExport === 0
                    ? "لا يوجد"
                    : viewItem.isExport === 1
                    ? "داخلي"
                    : viewItem.isExport === 2
                    ? "خارجي"
                    : "—"
                }}
              </div>
            </div>
            <div class="col-md-12">
              <label class="form-label">أسماء الجرحى</label>
              <div class="form-control">
                {{
                  incomingView.injuredNames?.length
                    ? incomingView.injuredNames.join("، ")
                    : "—"
                }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">رقم الوارد</label>
              <div class="form-control">
                {{ incomingView.incomingBookNumber || "—" }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الوارد</label>
              <div class="form-control">
                {{ formatDate(incomingView.incomingDate) }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">الموضوع</label>
              <div class="form-control">
                {{ viewItem.subject || "—" }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">المحتوى</label>
              <div class="form-control">
                {{ viewItem.content || "—" }}
              </div>
            </div>

            <!-- ===== بيانات الإدخال ===== -->
            <div class="col-md-6">
              <label class="form-label">اسم المُدخل</label>
              <div class="form-control">
                {{ viewItem.createdByUserName || "—" }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الإدخال</label>
              <div class="form-control">
                {{ formatDate(viewItem.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="closeView">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Advanced Search Modal -->
  <div
    class="modal fade"
    ref="advancedModal"
    tabindex="-1"
    @hidden.bs.modal="resetFilters"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-sm border-0">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">رقم المذكرة</label>
              <input v-model="filters.memoNumber" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">عدد الكتاب</label>
              <input v-model="filters.bookCount" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">من تاريخ المذكرة</label>
              <input
                type="date"
                v-model="filters.memoDateFrom"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ المذكرة</label>
              <input
                type="date"
                v-model="filters.memoDateTo"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">بحث</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Landa View Modal -->
  <div class="modal fade" ref="archiveModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-folder2-open me-1"></i>
            مرفقات الإدارة والبيانات
          </h5>
        </div>

        <div class="modal-body">
          <div
            v-if="archiveFiles.length === 0"
            class="text-muted text-center py-4"
          >
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            لا توجد مرفقات
          </div>

          <div v-else class="list-group">
            <button
              v-for="(file, i) in archiveFiles"
              :key="i"
              class="list-group-item list-group-item-action d-flex align-items-center gap-2"
              @click="openFile(file.fileFullUrl)"
            >
              <i class="bi bi-file-earmark-pdf text-danger fs-5"></i>
              <span class="flex-grow-1">{{ file.fileName }}</span>
              <i class="bi bi-box-arrow-up-right text-muted"></i>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" @click="openArchiveUploadFromView">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
          </button>
          <button class="btn btn-light" @click="closeArchive">إغلاق</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Upload Modal -->
  <div class="modal fade" ref="archiveUploadModalEl" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-cloud-upload me-1"></i>
            رفع مرفقات
          </h5>
        </div>

        <div class="modal-body">
          <div
            v-for="(item, index) in archiveInputs"
            :key="index"
            class="d-flex gap-2 mb-2"
          >
            <input
              type="file"
              multiple
              class="form-control"
              @change="onArchiveFilesSelected($event, index)"
            />

            <button
              v-if="archiveInputs.length > 1"
              class="btn btn-outline-danger"
              @click="removeArchiveInput(index)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <button class="btn btn-search w-100 mt-3" @click="addArchiveInput">
            <i class="bi bi-plus-lg me-1"></i>
            إضافة مرفق آخر
          </button>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchiveUpload">
            إلغاء
          </button>
          <button
            class="btn btn-primary"
            :disabled="isUploadingArchive"
            @click="submitArchiveUpload"
          >
            <span
              v-if="isUploadingArchive"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            {{ isUploadingArchive ? "جارٍ الرفع..." : "رفع" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- BULK TRANSFER Modal -->
  <div class="modal fade" tabindex="-1" ref="bulkTransferModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">ترحيل المحدد إلى قسم</h5>
        </div>

        <form @submit.prevent="bulkTransferFunc">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label">القسم</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="bulkTransfer.departmentId"
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
              type="button"
              class="btn btn-primary"
              :disabled="bulkTransferLoading"
              :class="{ 'btn-saving': bulkTransferLoading }"
              @click="bulkTransferFunc"
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

          <div v-if="!allNames.length" class="text-muted text-center py-3">
            لا توجد أسماء
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

  <!-- Manager Notes Modal -->
  <div class="modal fade" tabindex="-1" ref="managerNotesModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">هوامش مدير القسم</h5>
        </div>

        <div class="modal-body">
          <div v-if="selectedManagerNotes.length">
            <div
              v-for="(n, i) in selectedManagerNotes"
              :key="i"
              class="border-bottom py-3"
            >
              <div class="fw-bold mb-1">{{ i + 1 }}. هامش مدير القسم</div>

              <div class="text-muted small mb-2">
                {{ formatDate(n.noteDate) }}
              </div>

              <div class="note-box">
                {{ n.managerNote || "—" }}
              </div>
            </div>
          </div>

          <p v-else class="text-muted text-center">لا توجد هوامش</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeManagerNotes">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Division Note Modal -->
  <div class="modal fade" tabindex="-1" ref="divisionNoteModalEl">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">هامش مسؤول الشعبة</h5>
        </div>

        <div class="modal-body">
          <div v-if="divisionNoteText" class="note-box">
            {{ divisionNoteText }}
          </div>

          <p v-else class="text-muted text-center">لا يوجد هامش</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeDivisionNoteModal">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import VueSelect from "vue3-select";
import {
  getLanda,
  addLanda,
  updateLanda,
  deleteLanda,
  transferLanda,
  getLandaViwe,
} from "@/services/Data-management.service.js";
import { getDepartments } from "@/services/departments.service.js";
import {
  successAlert,
  errorAlert,
  confirmDelete,
  confirmAction,
} from "@/utils/alert.js";
import {
  uploadIncomingArchive,
  getIncomingArchive,
} from "@/services/incoming-archive.service.js";

const route = useRoute();
const list = ref([]);
const loading = ref(false);

// ===== Pagination =====
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

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

const exportTypeOptions = [
  { label: "لا يوجد", value: 0 },
  { label: "صادر داخلي", value: 1 },
  { label: "صادر خارجي", value: 2 },
];

// ===== مودالات =====
const modalEl = ref(null);
const transferModalEl = ref(null);
const bulkTransferModalEl = ref(null);
let modal = null;
let transferModal = null;
let bulkTransferModal = null;
const editMode = ref(false);

// ===== Selection state for bulk operations =====
const selectedDepartmentIds = ref([]);
const selectAll = ref(false);

// ===== فورم الإضافة/التعديل =====
const form = reactive({
  id: "",
  marginNoteId: null,
  memoNumber: "",
  memoDate: "",
  isExport: 0,
  hasOriginalFile: false,
});

const departments = ref([]);
const transferForm = reactive({
  landaId: "",
  departmentId: "",
  notes: "",
  files: [],
});

// ===== Bulk Transfer Form =====
const bulkTransfer = reactive({
  departmentId: null,
  notes: "",
});

// ===== Bulk Transfer Loading =====
const bulkTransferLoading = ref(false);

const load = async () => {
  loading.value = true;

  try {
    let hasOriginal = null;
    if (filters.hasOriginalFile === "true") hasOriginal = true;
    else if (filters.hasOriginalFile === "false") hasOriginal = false;

    const res = await getLanda({
      pageNumber: page.value,
      pageSize,
      injuredName: filters.injuredName || null,
      marginNoteId: filters.marginNoteId || null,
      memoNumber: filters.memoNumber || null,
      bookCount: filters.bookCount || null,
      memoDateFrom: filters.memoDateFrom || null,
      memoDateTo: filters.memoDateTo || null,
      hasOriginalFile: hasOriginal,
      createdByUserId: filters.createdByUserId || null,
    });

    list.value = res.data.data || [];
    totalPages.value = res.data.pagination?.totalPages ?? 1;

    selectedDepartmentIds.value = [];
    selectAll.value = false;
  } catch (e) {
    console.error(e);
    errorAlert("فشل في جلب البيانات");
  } finally {
    loading.value = false;
  }
};

const loadDepartments = async () => {
  try {
    const res = await getDepartments({ pageNumber: 1, pageSize: 100 });
    departments.value = res.data.data;
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

const openAdd = (noteId) => {
  editMode.value = false;
  form.id = "";
  form.marginNoteId = noteId;
  form.memoNumber = "";
  form.memoDate = "";
  form.hasOriginalFile = false;
  modal.show();
};

const openEdit = (row) => {
  editMode.value = true;
  form.id = row.id;
  form.marginNoteId = row.marginNoteId;
  form.memoNumber = row.memoNumber;
  form.memoDate = row.memoDate ? row.memoDate.slice(0, 10) : "";
  form.hasOriginalFile = row.hasOriginalFile;
  form.isExport = row.isExport ?? 0;
  modal.show();
};

const isSaving = ref(false);

const save = async () => {
  if (isSaving.value) return;

  isSaving.value = true;

  const data = {
    marginNoteId: form.marginNoteId,
    memoNumber: form.memoNumber,
    memoDate: form.memoDate ? new Date(form.memoDate).toISOString() : null,
    hasOriginalFile: form.hasOriginalFile,
    isExport: form.isExport,
  };

  try {
    if (!editMode.value) {
      await addLanda(data);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateLanda(form.id, data);
      successAlert("تم التحديث بنجاح");
    }

    modal.hide();
    load();
  } catch (err) {
    errorAlert("فشل الحفظ");
    console.error(err);
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await deleteLanda(id);
      successAlert("تم الحذف بنجاح");
      load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  }
};

const close = () => modal.hide();
const openTransfer = (row) => {
  transferForm.landaId = row.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferForm.files = [];
  transferModal.show();
  console.log("Landa ID SENT =", transferForm.landaId);
};

const handleFileUpload = (event) => {
  transferForm.files = Array.from(event.target.files);
};

// ===== تنفيذ التحويل =====

const transferLoading = ref(false);
const transfer = async () => {
  if (transferLoading.value) return;
  transferLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("LandaId", transferForm.landaId);
    formData.append("DepartmentId", transferForm.departmentId);
    formData.append("Notes", transferForm.notes || "");

    if (transferForm.files?.length) {
      for (const file of transferForm.files) {
        formData.append("files", file);
      }
    }
    await transferLanda(formData);
    successAlert("تم التحويل بنجاح");
    transferModal.hide();
    load();
  } catch (e) {
    const serverMessage = e?.response?.data?.message || "حدث خطأ أثناء التحويل";
    transferModal.hide();
    errorAlert(serverMessage);
  } finally {
    transferLoading.value = false;
  }
};

const closeTransfer = () => transferModal.hide();
const changePage = (p) => {
  page.value = p;
  load();
};

const loadViewData = async (marginNoteId) => {
  const res = await getLandaViwe({
    pageNumber: 1,
    pageSize: 10,
    marginNoteId: marginNoteId,
  });

  return res.data.data;
};

const openView = (row) => {
  try {
    viewItem.memoNumber = row.memoNumber ?? "—";
    viewItem.memoDate = row.memoDate ?? null;
    viewItem.isExport = row.isExport ?? 0;

    viewItem.subject = row.subject ?? "—";
    viewItem.content = row.content ?? "—";

    incomingView.incomingBookNumber = row.incomingBookNumber ?? "—";
    incomingView.incomingDate = row.incomingDate ?? null;
    incomingView.injuredNames = Array.isArray(row.injuredNames)
      ? row.injuredNames
      : [];

    viewItem.createdByUserName = row.createdByUserName ?? "—";
    viewItem.createdAt = row.createdAt ?? null;

    viewModal.show();
  } catch (e) {
    console.error(e);
    errorAlert("فشل عرض البيانات");
  }
};

const viewModalEl = ref(null);
let viewModal = null;
const closeView = () => viewModal.hide();

const viewItem = reactive({
  memoNumber: "",
  memoDate: "",
  hasOriginalFile: false,
  createdByUserName: "",
  createdAt: "",
  marginNoteId: "",
  subject: "",
  content: "",
});

const incomingView = reactive({
  incomingBookNumber: "—",
  incomingDate: null,
  receiveDate: null,
  injuredNames: [],
  commandName: "—",
  formationName: "—",
});

const filters = reactive({
  injuredName: "",
  marginNoteId: "",
  memoNumber: "",
  memoDateFrom: "",
  memoDateTo: "",
  hasOriginalFile: "",
  createdByUserId: "",
});

const advancedModal = ref(null);
let modalAdvancedInstance = null;
const users = ref([
  // { id: "uuid", fullName: "اسم الموظف" }
]);

const openAdvanced = () => {
  modalAdvancedInstance = new bootstrap.Modal(advancedModal.value);
  modalAdvancedInstance.show();
};

const closeAdvanced = () => {
  modalAdvancedInstance.hide();
};

const applyAdvanced = () => {
  load();
  closeAdvanced();
};

const resetFilters = () => {
  Object.assign(filters, {
    injuredName: "",
    incomingId: "",
    managerNote: "",
    createdByUserId: "",
    createdAtFrom: "",
    createdAtTo: "",
    memoNumber: "",
    memoDateFrom: "",
    memoDateTo: "",
    hasOriginalFile: "",
  });
  load();
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedDepartmentIds.value = list.value.map((item) => item.id);
  } else {
    selectedDepartmentIds.value = [];
  }
};

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

  bulkTransfer.departmentId = null;
  bulkTransfer.notes = "";
  bulkTransferModal.show();
};

const bulkTransferFunc = async () => {
  if (bulkTransferLoading.value) return;

  if (!bulkTransfer.departmentId) {
    errorAlert("يرجى اختيار القسم");
    return;
  }

  bulkTransferLoading.value = true;

  try {
    // Process each selected item individually using the existing transfer function
    const successfulTransfers = [];
    const failedTransfers = [];

    for (const landaId of selectedDepartmentIds.value) {
      try {
        const formData = new FormData();
        formData.append("LandaId", landaId);
        formData.append("DepartmentId", bulkTransfer.departmentId);
        formData.append("Notes", bulkTransfer.notes || "");

        await transferLanda(formData);
        successfulTransfers.push(landaId);
      } catch (error) {
        console.error(`Error transferring landa ${landaId}:`, error);
        failedTransfers.push({ id: landaId, error: error.message });
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
  bulkTransfer.departmentId = null;
  bulkTransfer.notes = "";
  bulkTransferModal.hide();
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

const archiveModalEl = ref(null);
const archiveUploadModalEl = ref(null);

let archiveModal = null;
let archiveUploadModal = null;

const archiveFiles = ref([]);

const archiveInputs = ref([{ files: [] }]);
const currentIncomingId = ref("");

/* فتح عرض المرفقات */
const openArchive = (row) => {
  currentIncomingId.value = row.incomingId;
  archiveFiles.value = row.archiveIncoming?.items || [];
  archiveModal.show();
};

/* من العرض إلى الرفع */
const openArchiveUploadFromView = () => {
  archiveModal.hide();
  archiveUploadModal.show();
};

const closeArchive = () => archiveModal.hide();
const closeArchiveUpload = () => archiveUploadModal.hide();

/* اختيار ملفات */
const onArchiveFilesSelected = (e, index) => {
  archiveInputs.value[index].files = Array.from(e.target.files);
};

const addArchiveInput = () => {
  archiveInputs.value.push({ files: [] });
};

const removeArchiveInput = (index) => {
  archiveInputs.value.splice(index, 1);
};

/* رفع المرفقات */
const isUploadingArchive = ref(false);
const submitArchiveUpload = async () => {
  if (isUploadingArchive.value) return;

  const files = archiveInputs.value.flatMap((x) => x.files);

  if (!files.length) return errorAlert("يرجى اختيار ملفات");
  if (!currentIncomingId.value) return errorAlert("incomingId غير موجود");

  isUploadingArchive.value = true;

  try {
    await uploadIncomingArchive(currentIncomingId.value, files);

    archiveUploadModal.hide();
    successAlert("تم رفع المرفقات بنجاح");

    archiveInputs.value = [{ files: [] }];
    await load();

    const updatedRow = list.value.find(
      (x) => x.incomingId === currentIncomingId.value
    );
    if (updatedRow) openArchive(updatedRow);
  } catch (e) {
    console.error(e);
    errorAlert("فشل رفع المرفقات");
  } finally {
    isUploadingArchive.value = false;
  }
};

const openFile = (url) => {
  window.open(url, "_blank");
};

const allNames = ref([]);
const namesModalEl = ref(null);
let namesModal = null;

const openNamesModal = (names) => {
  allNames.value = names || [];
  namesModal.show();
};

const closeNamesModal = () => {
  namesModal.hide();
};

// ==============================
// Manager Notes Modal
// ==============================
const selectedManagerNotes = ref([]);
const managerNotesModalEl = ref(null);
let managerNotesModal = null;

const openManagerNotes = (notes = []) => {
  selectedManagerNotes.value = Array.isArray(notes) ? notes : [];
  managerNotesModal?.show();
};

const closeManagerNotes = () => {
  managerNotesModal?.hide();
};

// ==============================
// Division Note Modal
// ==============================
const divisionNoteModalEl = ref(null);
let divisionNoteModal = null;

const divisionNoteText = ref("");

const openDivisionNoteModal = (text) => {
  divisionNoteText.value = text || "";
  divisionNoteModal.show();
};

const closeDivisionNoteModal = () => {
  divisionNoteModal.hide();
};

onMounted(() => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  bulkTransferModal = new Modal(bulkTransferModalEl.value);
  viewModal = new Modal(viewModalEl.value);
  archiveModal = new Modal(archiveModalEl.value);
  archiveUploadModal = new Modal(archiveUploadModalEl.value);
  namesModal = new Modal(namesModalEl.value);
  managerNotesModal = new Modal(managerNotesModalEl.value);
  divisionNoteModal = new Modal(divisionNoteModalEl.value);
  load();
  loadDepartments();
});
</script>
