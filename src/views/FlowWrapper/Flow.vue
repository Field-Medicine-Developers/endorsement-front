<template>
  <div
    class="appbar rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center gap-2">
      <span
        class="appbar-icon d-inline-flex align-items-center justify-content-center"
      >
        <i class="bi bi-shield-check"></i>
      </span>
      <div>
        <h2 class="h5 fw-bold m-2">شعبة البيانات والتدقيق</h2>
        <small class="text-muted"> إدارة معاملات التدقيق </small>
      </div>
    </div>
  </div>

  <div class="stats-row">
    <!-- الكل -->
    <div class="stats-box stat-blue">
      <div class="text">
        <span class="title">الكل</span>
        <strong>{{ totalFromAdditional }}</strong>
      </div>
      <i class="bi bi-files icon"></i>
    </div>

    <!-- قيد الانتظار -->
    <div class="stats-box stat-dark">
      <div class="text">
        <span class="title">قيد الانتظار</span>
        <strong>{{ stats.additionalData.waitingCount }}</strong>
      </div>
      <i class="bi bi-hourglass-split icon"></i>
    </div>

    <!-- منجز -->
    <div class="stats-box stat-green">
      <div class="text">
        <span class="title">مكتب السيد المعاون</span>
        <strong>{{ stats.additionalData.completedCount }}</strong>
      </div>
      <i class="bi bi-check-circle icon"></i>
    </div>

    <!-- اعتذار -->
    <div class="stats-box stat-warning">
      <div class="text">
        <span class="title">اعتذار</span>
        <strong>{{ stats.additionalData.apologyCount }}</strong>
      </div>
      <i class="bi bi-exclamation-circle icon"></i>
    </div>

    <!-- غير منجز -->
    <div class="stats-box stat-danger">
      <div class="text">
        <span class="title">غير منجز</span>
        <strong>{{ stats.additionalData.notCompletedCount }}</strong>
      </div>
      <i class="bi bi-x-circle icon"></i>
    </div>

    <!-- مدقق -->
    <div class="stats-box stat-info">
      <div class="text">
        <span class="title">مدقق</span>
        <strong>{{ stats.additionalData.verifiedCount }}</strong>
      </div>
      <i class="bi bi-shield-check icon"></i>
    </div>

    <!-- غير مدقق -->
    <div class="stats-box stat-secondary">
      <div class="text">
        <span class="title">غير مدقق</span>
        <strong>{{ stats.additionalData.notVerifiedCount }}</strong>
      </div>
      <i class="bi bi-shield-x icon"></i>
    </div>

    <!-- غير معاد -->
    <div class="stats-box stat-blue">
      <div class="text">
        <span class="title">غير معاد</span>
        <strong>{{ stats.additionalData.isReturnFalseCount }}</strong>
      </div>
      <i class="bi bi-arrow-repeat icon"></i>
    </div>

    <!-- معاد -->
    <div class="stats-box stat-purple">
      <div class="text">
        <span class="title">معاد</span>
        <strong>{{ stats.additionalData.isReturnTrueCount }}</strong>
      </div>
      <i class="bi bi-arrow-counterclockwise icon"></i>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="card shadow-sm border-0 mb-3 p-3">
    <div class="row g-3">
      <!-- اسم الجريح -->
      <div class="col-md-6">
        <input
          v-model="filters.injuredName"
          class="form-control"
          placeholder="بحث بالاسم..."
          @keyup.enter="load"
        />
      </div>

      <!-- الأزرار -->
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
      <h5 class="mb-0 fw-bold primary">قائمة معاملات التدقيق</h5>
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
                <th>أسماء الجرحى</th>
                <th>رقم الوارد</th>
                <th>تاريخ الوارد</th>
                <th>رقم الكتاب</th>
                <th>القيادة / التشكيل</th>
                <th>استلام المعاملة</th>
                <th>تسليم المعاملة</th>
                <th>تسليم الطبيب العسكري</th>
                <th>استلام الطبيب العسكري</th>
                <th>تاريخ إرسال التدقيق</th>
                <th>استلام التدقيق</th>
                <th>إرسال الى مدير القسم</th>
                <th>استلام من مدير القسم</th>
                <th>المواقف</th>
                <th>الملاحظات</th>
                <th>الحالة</th>
                <!-- <th>سبب الرفض</th> -->
                <!-- <th>تاريخ الرفض</th> -->
                <th>حالة التدقيق</th>
                <th>الحالة النهائية</th>
                <th>إرجاع</th>
                <th>سبب الإرجاع</th>
                <th>تاريخ الإرجاع</th>
                <th>أضيف بواسطة</th>
                <th>تاريخ الإضافة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in list" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <!-- أسماء الجرحى -->

                <td>{{ item.injuredName }}</td>
                <td>{{ item.incomingBookNumber || "-" }}</td>
                <td>{{ formatDate(item.incomingDate) }}</td>
                <td>{{ item.incomingBookNumber || "-" }}</td>

                <td>
                  <div class="fw-bold">{{ item.command?.name || "—" }}</div>
                  <small class="text-muted">
                    {{ item.formation?.name || "—" }}</small
                  >
                </td>

                <td>{{ formatDate(item.transactionReceiveDate) }}</td>
                <td>{{ formatDate(item.transactionDeliveryDate) }}</td>
                <td>{{ formatDate(item.militaryDoctorDelivery) }}</td>
                <td>{{ formatDate(item.militaryDoctorReceive) }}</td>
                <td>{{ formatDate(item.verificationSendDate) }}</td>
                <td>{{ formatDate(item.verificationReceive) }}</td>
                <td>{{ formatDate(item.directorpprovalSendDate) }}</td>
                <td>{{ formatDate(item.directorpprovalReceive) }}</td>
                <td>
                  <button class="btn btn-search" @click="openSituations(item)">
                    عرض المواقف ({{ item.situations?.length || 0 }})
                  </button>
                </td>

                <td class="text-truncate" style="max-width: 180px">
                  {{ item.notes || "-" }}
                </td>
                <!-- الحالة -->
                <td>
                  <span v-if="item.status === 0" class="badge bg-secondary">
                    <i class="bi bi-hourglass-split"></i>
                    قيد الانتظار
                  </span>

                  <span v-else-if="item.status === 1" class="badge bg-success">
                    <i class="bi bi-check-circle-fill"></i>
                    مقبول
                  </span>

                  <span v-else-if="item.status === 2" class="badge bg-danger">
                    <i class="bi bi-x-circle-fill"></i>
                    مرفوض
                  </span>
                </td>
                <!-- سبب الرفض -->
                <td>{{ item.rejectionReason || "-" }}</td>
                <!-- تاريخ الرفض -->
                <td>{{ formatDate(item.rejectionDate) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-warning': item.verificationStatus === 0,
                      'bg-primary': item.verificationStatus === 1,
                      'bg-danger': item.verificationStatus === 2,
                    }"
                  >
                    {{ verificationStatusText(item.verificationStatus) }}
                  </span>
                </td>

                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-secondary': item.finalStatus === 0,
                      'bg-success': item.finalStatus === 1,
                      'bg-warning': item.finalStatus === 3,
                      'bg-danger': item.finalStatus === 4,
                    }"
                  >
                    {{ finalStatusText(item.finalStatus) }}
                  </span>
                </td>

                <td>
                  <span v-if="item.isReturn === 1" class="badge bg-warning"
                    >معاد</span
                  >
                  <span v-else class="badge bg-success">غير معاد</span>
                </td>
                <!-- <td>{{ item.returnPercentage || "-" }}</td> -->
                <!-- <td>{{ formatDate(item.returnDate) }}</td> -->

                <td>{{ item.createdByUserName }}</td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button class="button-add" @click="openAdd(item)">
                      <svg class="svgIcon" viewBox="0 0 448 512">
                        <path
                          d="M432 256c0 17.7-14.3 32-32 32h-128v128c0 17.7-14.3 
                             32-32 32s-32-14.3-32-32V288H80c-17.7 
                             0-32-14.3-32-32s14.3-32 32-32h128V96c0-17.7 
                             14.3-32 32-32s32 14.3 32 32v128h128c17.7 
                             0 32 14.3 32 32z"
                        />
                      </svg>
                    </button>

                    <!-- عرض -->
                    <button class="button-view" @click="openView(item)">
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
                    <!-- حذف -->
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

                    <!-- تحويل -->
                    <button class="button-transfer" @click="openTransfer(item)">
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
                  </div>
                </td>
              </tr>

              <tr v-if="list.length === 0">
                <td colspan="13" class="py-4 text-muted">
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

  <!-- Add / Edit Modal -->
  <div class="modal fade" tabindex="-1" ref="modalEl">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            {{ editMode ? "تعديل بيانات التدقيق" : "إضافة بيانات للتدقيق" }}
          </h5>
        </div>

        <!-- ===== LOADING OVERLAY ===== -->
        <div v-if="loadingExisting" class="modal-loading">
          <div class="spinner mt-5 mb-5"></div>
        </div>

        <!-- ===== FORM ===== -->
        <form v-else @submit.prevent>
          <div class="modal-body">
            <!-- بيانات الوارد -->
            <!-- <div class="return-info-box mb-4">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="info-row">
                  <span class="info-icon"><i class="bi bi-person-fill"></i></span>
                  <div class="info-text">
                    <span class="label">رقم الوارد</span>
                    <span class="value">{{ form.incomingBookNumber || "-" }}</span>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="info-row">
                  <span class="info-icon"><i class="bi bi-journal-text"></i></span>
                  <div class="info-text">
                    <span class="label">موضوع الوارد</span>
                    <span class="value">{{ form.incomingSubject || "-" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div> -->

            <input type="hidden" v-model="form.incomingId" />

            <!-- ================= STEP 1 ================= -->
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">تاريخ استلام المعاملة</label>
                <input
                  type="date"
                  v-model="form.transactionReceiveDate"
                  class="form-control"
                  :disabled="!editMode && step !== 1"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ تسليم المعاملة</label>
                <input
                  type="date"
                  v-model="form.transactionDeliveryDate"
                  class="form-control"
                  :disabled="!editMode && step !== 1"
                />
              </div>

              <!-- ================= STEP 2 ================= -->
              <div class="col-md-6">
                <label class="form-label">استلام الطبيب العسكري</label>
                <input
                  type="date"
                  v-model="form.militaryDoctorReceive"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تسليم الطبيب العسكري</label>
                <input
                  type="date"
                  v-model="form.militaryDoctorDelivery"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ تسليم التدقيق</label>
                <input
                  type="date"
                  v-model="form.verificationSendDate"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ استلام التدقيق</label>
                <input
                  type="date"
                  v-model="form.verificationReceive"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ إرسال موافقة المدير</label>
                <input
                  type="date"
                  v-model="form.directorpprovalSendDate"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">تاريخ استلام موافقة المدير</label>
                <input
                  type="date"
                  v-model="form.directorpprovalReceive"
                  class="form-control"
                  :disabled="!editMode && step !== 2"
                />
              </div>

              <!-- ================= STEP 3 ================= -->

              <div class="col-md-6">
                <label class="form-label">حالة التدقيق</label>
                <div class="custom-vue-select-container mb-3">
                  <VueSelect
                    v-model="form.verificationStatus"
                    :options="verificationStatusOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    :disabled="!editMode && step !== 3"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">الحالة النهائية</label>
                <div class="custom-vue-select-container mb-3">
                  <VueSelect
                    v-model="form.finalStatus"
                    :options="finalStatusOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    :disabled="!editMode && step !== 3"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">هل معاد؟</label>
                <div class="custom-vue-select-container mb-3">
                  <VueSelect
                    v-model="form.isReturn"
                    :options="isReturnOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    :disabled="!editMode && step !== 3"
                  />
                </div>
              </div>

              <div class="col-md-6" v-if="form.isReturn === 1">
                <label class="form-label">سبب الإرجاع</label>
                <input
                  v-model="form.returnPercentage"
                  class="form-control"
                  :disabled="!editMode && step !== 3"
                />
              </div>

              <div class="col-md-6" v-if="form.isReturn === 1">
                <label class="form-label">تاريخ الإرجاع</label>
                <input
                  type="date"
                  v-model="form.returnDate"
                  class="form-control"
                  :disabled="!editMode && step !== 3"
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">الملاحظات</label>
                <textarea
                  v-model="form.notes"
                  class="form-control"
                  :disabled="!editMode && step !== 3"
                ></textarea>
              </div>
            </div>

            <!-- ================= المواقف ================= -->
            <div class="mt-4 situations-box">
              <h6 class="fw-bold mb-3">المواقف</h6>

              <div
                class="row g-3 mb-3"
                v-for="(s, i) in form.situations"
                :key="i"
              >
                <div class="col-md-3">
                  <!-- <label class="form-label">رقم المواقف</label> -->
                  <input
                    v-model="s.situationNumber"
                    class="form-control"
                    :disabled="!editMode && step !== 3"
                    placeholder="رقم الموقف"
                  />
                </div>

                <div class="col-md-8">
                  <!-- <label class="form-label">عنوان المواقف</label> -->
                  <input
                    v-model="s.situationName"
                    class="form-control"
                    :disabled="!editMode && step !== 3"
                    placeholder="عنوان الموقف"
                  />
                </div>

                <div class="col-md-1">
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="removeSituationRow(i)"
                    :disabled="!editMode && step !== 3"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-add btn-sm"
                @click="addSituationRow"
                :disabled="!editMode && step !== 3"
              >
                + إضافة موقف
              </button>
            </div>
          </div>

          <!-- ================= Footer ================= -->
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="close">
              إلغاء
            </button>
            <button
              type="button"
              class="btn btn-add d-flex align-items-center gap-2"
              :disabled="isSending"
              @click="saveStep"
            >
              <span v-if="!isSending">إرسال</span>

              <span v-else class="d-flex align-items-center gap-2">
                <span class="spinner-border spinner-border-sm"></span>
                جارٍ الإرسال…
              </span>
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
                    :options="departmentsSelect"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="اختر القسم"
                    searchable
                  />
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label">ملاحظات</label>
                <textarea
                  v-model="transferForm.notes"
                  class="form-control"
                  rows="3"
                  placeholder="سبب التحويل أو ملاحظات إضافية..."
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-light"
              type="button"
              @click="closeTransfer()"
            >
              إلغاء
            </button>
            <button
              class="btn btn-primary"
              :class="{ 'btn-saving': isTransferring }"
              :disabled="isTransferring"
              @click="transfer"
            >
              <span
                v-if="isTransferring"
                class="spinner-border spinner-border-sm me-2"
              ></span>

              {{ isTransferring ? "جارٍ التحويل..." : "تحويل" }}
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
          <h5 class="modal-title fw-bold primary">تفاصيل معاملة التدقيق</h5>
        </div>

        <div class="modal-body" v-if="selected">
          <div class="row g-3">
            <div class="col-md-12">
              <label class="form-label">أسماء الجرحى</label>
              <input
                class="form-control"
                :value="selected.injuredNames?.join('، ') || '—'"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ استلام المعاملة</label>
              <input
                class="form-control"
                :value="formatDate(selected.transactionReceiveDate)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ تسليم المعاملة</label>
              <input
                class="form-control"
                :value="formatDate(selected.transactionDeliveryDate)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">استلام الطبيب العسكري</label>
              <input
                class="form-control"
                :value="formatDate(selected.militaryDoctorReceive)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تسليم الطبيب العسكري</label>
              <input
                class="form-control"
                :value="formatDate(selected.militaryDoctorDelivery)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">استلام التدقيق</label>
              <input
                class="form-control"
                :value="formatDate(selected.verificationReceive)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تسليم التدقيق</label>
              <input
                class="form-control"
                :value="formatDate(selected.verificationSendDate)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">استلام من مدير القسم </label>
              <input
                class="form-control"
                :value="formatDate(selected.directorpprovalReceive)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تسليم من مدير القسم</label>
              <input
                class="form-control"
                :value="formatDate(selected.directorpprovalSendDate)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">حالة الإرجاع</label>
              <input
                class="form-control"
                :value="selected.isReturn === 1 ? 'نعم' : 'لا'"
                disabled
              />
            </div>

            <div class="col-md-6" v-if="selected.isReturn === 1">
              <label class="form-label">نسبة الإرجاع</label>
              <input
                class="form-control"
                :value="selected.returnPercentage"
                disabled
              />
            </div>

            <div class="col-md-6" v-if="selected.isReturn === 1">
              <label class="form-label">تاريخ الإرجاع</label>
              <input
                class="form-control"
                :value="formatDate(selected.returnDate)"
                disabled
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">حالة التدقيق</label>
              <input
                class="form-control"
                :value="verificationStatusText(selected.verificationStatus)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ حالة التدقيق</label>
              <input
                class="form-control"
                :value="formatDate(selected.statusAuditHistory)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">الحالة النهائية</label>
              <input
                class="form-control"
                :value="finalStatusText(selected.finalStatus)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الحالة النهائية</label>
              <input
                class="form-control"
                :value="formatDate(selected.finalStatusDate)"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">سجل التدقيق</label>
              <input
                class="form-control"
                :value="formatDate(selected.statusAuditHistory)"
                disabled
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">الملاحظات</label>
              <textarea
                class="form-control"
                rows="3"
                :value="selected.notes"
                disabled
              ></textarea>
            </div>

            <div class="col-md-12">
              <label class="form-label">الموقف</label>

              <div class="badges-box">
                <template
                  v-if="selected.situations && selected.situations.length"
                >
                  <span
                    v-for="(s, i) in selected.situations"
                    :key="i"
                    class="badge-tag"
                  >
                    {{ s.situationNumber }} - {{ s.situationName }}
                  </span>
                </template>

                <span v-else class="text-muted">لا يوجد موقف مسجل</span>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">أضيف بواسطة</label>
              <input
                class="form-control"
                :value="selected.createdByUserName"
                disabled
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الإضافة</label>
              <input
                class="form-control"
                :value="formatDate(selected.createdAt)"
                disabled
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" type="button" @click="closeView()">
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
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
        </div>

        <div class="modal-body">
          <div class="row g-3">
            <!-- <div class="col-md-6">
              <label class="form-label">موضوع الوارد</label>
              <input
                v-model="filters.incomingId"
                class="form-control"
                placeholder="بحث بواسطة موضوع"
              />
            </div> -->

            <div class="col-md-6">
              <label class="form-label">من تاريخ استلام المعاملة</label>
              <input
                v-model="filters.transactionReceiveDateFrom"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">إلى تاريخ استلام المعاملة</label>
              <input
                v-model="filters.transactionReceiveDateTo"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-md-6">
              <div class="custom-vue-select-container mb-3">
                <label class="form-label">الحالة النهائية</label>
                <VueSelect
                  v-model="filters.finalStatusType"
                  :options="finalStatusOptions"
                  label="label"
                  :reduce="(o) => o.value"
                  placeholder="الكل"
                  clearable
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="custom-vue-select-container mb-3">
                <label class="form-label">حالة التدقيق</label>
                <VueSelect
                  v-model="filters.verificationStatus"
                  :options="verificationStatusOptions"
                  label="label"
                  :reduce="(o) => o.value"
                  placeholder="الكل"
                  clearable
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="custom-vue-select-container mb-3">
                <label class="form-label">معادة</label>
                <VueSelect
                  v-model="filters.isReturn"
                  :options="isReturnOptions"
                  label="label"
                  :reduce="(o) => o.value"
                  placeholder="الكل"
                  clearable
                />
              </div>
            </div>

            <!-- <div class="col-md-6">
              <label class="form-label">أضيف بواسطة</label>
              <select v-model="filters.createdByUserId" class="form-select">
                <option value="">الكل</option>
                <option v-for="u in users" :key="u.id" :value="u.id">
                  {{ u.fullName }}
                </option>
              </select>
            </div> -->
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeAdvanced()">إغلاق</button>
          <button class="btn btn-add" @click="applyAdvanced()">تطبيق</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Situations -->
  <div class="modal fade" ref="situationsModalEl">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">المواقف المسجلة</h5>
        </div>

        <div class="modal-body">
          <div v-if="selectedSituations.length" class="situations-list">
            <div
              v-for="(s, i) in selectedSituations"
              :key="i"
              class="situation-item"
            >
              <!-- الرقم -->
              <div class="s-number">
                {{ i + 1 }}
              </div>

              <!-- المحتوى -->
              <div class="s-content">
                <div class="s-title">
                  {{ s.situationNumber || "—" }}
                </div>

                <div class="s-name">
                  {{ s.situationName || "لا يوجد اسم موقف" }}
                </div>
              </div>
            </div>
          </div>

          <p v-else class="text-muted text-center">لا توجد مواقف</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeSituations()">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Names Modal (عرض كل الأسماء) -->
  <div class="modal fade" tabindex="-1" ref="namesModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">أسماء الجرحى</h5>
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import VueSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";
import {
  getAuditingAndData,
  addAuditingAndData,
  updateAuditingAndData,
  deleteAuditingAndData,
  transferAuditingAndData,
} from "@/services/auditing-and-data.service.js";
import { getIncomings } from "@/services/incoming.service.js";
import { getDepartments } from "@/services/departments.service.js";
import { successAlert, errorAlert, confirmDelete } from "@/utils/alert.js";

const route = useRoute();
const incomingIdFromRoute = route.query.injuredPersonIds || null;
const list = ref([]);
const loading = ref(false);

// ===== الفلاتر =====
const filters = reactive({
  injuredName: "", // موجود خارج المودال
  incomingId: "",
  transactionReceiveDateFrom: "",
  transactionReceiveDateTo: "",
  createdByUserId: "",

  finalStatusType: null,
  verificationStatus: null,
  isReturn: null,

  pageNumber: 1,
  pageSize: 10,
});

/* ---------------- ENUMS ---------------- */
/* FinalStatusType enum */
const FinalStatusType = {
  Defult: 0,
  Completed: 1,
  Apology: 3,
  NotCompleted: 4,
};

const VerificationStatus = {
  Defult: 0,
  Verified: 1,
  NotVerified: 2,
};

const finalStatusOptions = [
  { value: FinalStatusType.Defult, label: "بدون" },
  { value: FinalStatusType.Completed, label: "مكتب السيد المعاون" },
  { value: FinalStatusType.Apology, label: "استرجاع" },
  // { value: FinalStatusType.NotCompleted, label: "غير منجز" },
];

const verificationStatusOptions = [
  { value: VerificationStatus.Defult, label: "بدون" },
  { value: VerificationStatus.Verified, label: "مدقق" },
  { value: VerificationStatus.NotVerified, label: "غير مدقق" },
];

const IsReturnEnum = {
  False: 0,
  True: 1,
};

const isReturnOptions = [
  { value: IsReturnEnum.False, label: "لا" },
  { value: IsReturnEnum.True, label: "نعم" },
];

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

const departments = ref([]);
const departmentsSelect = ref([]);
const modalEl = ref(null);
const transferModalEl = ref(null);
const viewModalEl = ref(null);
let modal = null;
let transferModal = null;
let viewModal = null;
const editMode = ref(false);

const form = reactive({
  id: "",
  injuredPersonIds: incomingIdFromRoute,
  transactionReceiveDate: "",
  transactionDeliveryDate: "",
  militaryDoctorReceive: "",
  militaryDoctorDelivery: "",
  verificationReceive: "",
  verificationSendDate: "",
  directorpprovalSendDate: "",
  directorpprovalReceive: "",
  notes: "",
  finalStatus: 0,
  verificationStatus: 0,
  isReturn: 0,
  returnPercentage: "",
  returnDate: "",
  situations: [
    {
      situationNumber: "1",
      situationName: "",
    },
  ],
  statusAuditHistory: null,
  finalStatusDate: "",
  injuredNames: [],
});

const transferForm = reactive({
  auditingAndDataId: "",
  departmentId: "",
  notes: "",
});

const transferLoading = ref(false);

// ===== Selected for view =====
const selected = ref(null);

const load = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: page.value,
      pageSize,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    const res = await getAuditingAndData(params);

    const rawList = res.data.data ?? [];

    list.value = rawList.map((item) => ({
      ...item,
      injuredName: item.injuredPersonName || "-",
    }));
    totalPages.value = res.data.pagination?.totalPages ?? 1;
  } catch (e) {
    console.error(e);
    errorAlert("فشل في جلب بيانات التدقيق");
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  Object.assign(filters, {
    injuredName: "",
    incomingId: "",
    transactionReceiveDateFrom: "",
    transactionReceiveDateTo: "",
    createdByUserId: "",

    finalStatusType: null,
    verificationStatus: null,
    isReturn: null,
  });
  load();
};

const loadDepartments = async () => {
  try {
    const res = await getDepartments({ pageNumber: 1, pageSize: 100 });
    departments.value = res.data.data ?? [];

    departmentsSelect.value = departments.value.map((d) => ({
      label: d.name,
      value: d.id,
    }));
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

const loadInjuredPersonIdsFromIncoming = async (incomingId) => {
  if (!incomingId) return [];

  const res = await getIncomings({
    pageNumber: 1,
    pageSize: 1,
    incomingId: incomingId,
  });

  const item = res.data.data?.[0];

  return Array.isArray(item?.injuredPersonIds)
    ? item.injuredPersonIds.filter(Boolean)
    : [];
};

const openAdd = async (row) => {
  editMode.value = false;
  const injuredIds = await loadInjuredPersonIdsFromIncoming(row.incomingId);
  if (!Array.isArray(injuredIds) || injuredIds.length === 0) {
    errorAlert("لا يمكن إضافة تدقيق بدون تحديد جريح");
    return;
  }
  Object.assign(form, {
    id: "",
    incomingId: row.incomingId,
    injuredPersonIds: [row.injuredPersonId],
    incomingBookNumber: row.incomingBookNumber || "",
    incomingSubject: row.incomingSubject || "",
    injuredPersonIds: injuredIds,
    transactionReceiveDate: "",
    transactionDeliveryDate: "",
    militaryDoctorReceive: "",
    militaryDoctorDelivery: "",
    verificationReceive: "",
    verificationSendDate: "",
    directorpprovalSendDate: "",
    directorpprovalReceive: "",
    verificationStatus: 0,
    finalStatus: 0,
    isReturn: 0,
    returnPercentage: "",
    returnDate: "",
    notes: "",
    situations: [{ situationNumber: "1", situationName: "" }],
  });

  step.value = 1;
  modal.show();
  // loadExistingAuditing(row);
  loadExistingAuditing(row.injuredPersonId);
};

const openEdit = async (row) => {
  editMode.value = true;
  const injuredIds = await loadInjuredPersonIdsFromIncoming(
    row.incomingId || row.id
  );
  if (injuredIds.length === 0) {
    errorAlert("بيانات الجريح غير مكتملة");
    return;
  }
  Object.assign(form, {
    id: row.id,
    injuredPersonIds: [row.injuredPersonId],
    transactionReceiveDate: row.transactionReceiveDate?.slice(0, 10) || "",
    transactionDeliveryDate: row.transactionDeliveryDate?.slice(0, 10) || "",
    militaryDoctorReceive: row.militaryDoctorReceive?.slice(0, 10) || "",
    militaryDoctorDelivery: row.militaryDoctorDelivery?.slice(0, 10) || "",
    verificationReceive: row.verificationReceive?.slice(0, 10) || "",
    verificationSendDate: row.verificationSendDate?.slice(0, 10) || "",
    directorpprovalSendDate: row.directorpprovalSendDate?.slice(0, 10) || "",
    directorpprovalReceive: row.directorpprovalReceive?.slice(0, 10) || "",
    verificationStatus: row.verificationStatus ?? 0,
    finalStatus: row.finalStatus ?? 0,
    isReturn: row.isReturn ?? 0,
    returnPercentage: row.returnPercentage || "",
    returnDate: row.returnDate?.slice(0, 10) || "",
    notes: row.notes || "",
    situations: row.situations?.map((s, i) => ({
      situationNumber: s.situationNumber || String(i + 1),
      situationName: s.situationName || "",
    })) || [{ situationNumber: "1", situationName: "" }],
  });

  modal.show();
  loadExistingAuditing(row.injuredPersonId);
};

const addSituationRow = () => {
  form.situations.push({
    situationNumber: String(form.situations.length + 1),
    situationName: "",
  });
};

const removeSituationRow = (index) => {
  if (form.situations.length === 1) return;
  form.situations.splice(index, 1);
};

const verificationStatusText = (v) =>
  verificationStatusOptions.find((x) => x.value === v)?.label ?? "-";

const finalStatusText = (v) =>
  finalStatusOptions.find((x) => x.value === v)?.label ?? "-";

const save = async () => {
  const data = {
    injuredPersonIds: form.injuredPersonIds,
    transactionReceiveDate: form.transactionReceiveDate || null,
    transactionDeliveryDate: form.transactionDeliveryDate || null,
    militaryDoctorReceive: form.militaryDoctorReceive || null,
    militaryDoctorDelivery: form.militaryDoctorDelivery || null,
    verificationReceive: form.verificationReceive || null,
    verificationSendDate: form.verificationSendDate || null,
    notes: form.notes || null,
    verificationStatus: form.verificationStatus,
    isReturn: form.isReturn,
    returnPercentage: form.isReturn === 1 ? form.returnPercentage : null,
    returnDate: form.isReturn === 1 ? form.returnDate : null,
    finalStatus: form.finalStatus,
    situations: form.situations
      .filter((s) => s.situationName || s.situationNumber)
      .map((s) => ({
        situationNumber: s.situationNumber || "",
        situationName: s.situationName || "",
      })),
  };

  try {
    if (!editMode.value) {
      await addAuditingAndData(data);
      successAlert("تمت إضافة بيانات التدقيق بنجاح");
    } else {
      await updateAuditingAndData(form.id, data);
      successAlert("تم تحديث بيانات التدقيق بنجاح");
    }

    modal.hide();
    load();
  } catch (e) {
    console.error(e);
    errorAlert("حدث خطأ أثناء الحفظ");
  }
};

const remove = async (id) => {
  const result = await confirmDelete();
  if (result.isConfirmed) {
    try {
      await deleteAuditingAndData(id);
      successAlert("تم الحذف بنجاح");
      load();
    } catch (e) {
      errorAlert("فشل الحذف");
    }
  }
};

const close = () => modal.hide();

const openTransfer = (row) => {
  transferForm.auditingAndDataId = row.id;
  transferForm.departmentId = "";
  transferForm.notes = "";
  transferModal.show();
};

const isTransferring = ref(false);
const transfer = async () => {
  if (transferLoading.value) return;
  transferLoading.value = true;
  try {
    const body = {
      auditingAndDataId: transferForm.auditingAndDataId,
      departmentId: transferForm.departmentId,
      notes: transferForm.notes || null,
    };
    await transferAuditingAndData(body);
    successAlert("تم تحويل المعاملة بنجاح");
    transferModal.hide();
    load();
  } catch (error) {
    console.error("Error transferring AuditingAndData:", error);
    const serverMessage =
      error?.response?.data?.message || "حدث خطأ أثناء التحويل";
    errorAlert(serverMessage);
  } finally {
    transferLoading.value = false;
  }
};

const closeTransfer = () => transferModal.hide();

// ===== View =====
const openView = (row) => {
  selected.value = row;
  viewModal.show();
};

const closeView = () => {
  viewModal.hide();
  selected.value = null;
};

const advancedModal = ref(null);
let modalAdvancedInstance = null;

const openAdvanced = () => {
  if (!modalAdvancedInstance) {
    modalAdvancedInstance = new Modal(advancedModal.value);
  }
  modalAdvancedInstance.show();
};

const applyAdvanced = () => {
  page.value = 1;
  load();
  closeAdvanced();
};

const closeAdvanced = () => {
  modalAdvancedInstance?.hide();
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

const changePage = (p) => {
  page.value = p;
  load();
};

const situationsModalEl = ref(null);
let situationsModal = null;

const selectedSituations = ref([]);

const openSituations = (row) => {
  selectedSituations.value = row.situations || [];
  situationsModal.show();
};

const closeSituations = () => {
  situationsModal.hide();
};

const step = computed(() => {
  // STEP 1
  if (!form.transactionDeliveryDate) {
    return 1;
  }
  // STEP 2
  if (
    !form.militaryDoctorReceive ||
    !form.militaryDoctorDelivery ||
    !form.verificationReceive ||
    !form.verificationSendDate
  ) {
    return 2;
  }
  // STEP 3
  return 3;
});

const stepRequiredFields = {
  1: ["transactionDeliveryDate"],
  2: [
    "militaryDoctorReceive",
    "militaryDoctorDelivery",
    "verificationReceive",
    "verificationSendDate",
    "directorpprovalSendDate",
    "directorpprovalReceive",
  ],

  3: ["verificationStatus", "finalStatus"],
};

const isStepComplete = (stepNumber) => {
  const fields = stepRequiredFields[stepNumber] || [];

  return fields.every((field) => {
    const value = form[field];
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });
};

const getExistingAuditingByInjured = async () => {
  if (!form.injuredPersonIds || form.injuredPersonIds.length === 0) {
    return null;
  }

  const res = await getAuditingAndData({
    injuredPersonIds: form.injuredPersonIds,
    pageNumber: 1,
    pageSize: 1,
  });

  return res?.data?.data?.[0] || null;
};

const buildPayload = () => {
  const injuredIds = Array.isArray(form.injuredPersonIds)
    ? form.injuredPersonIds.filter(Boolean)
    : [];

  if (injuredIds.length === 0) {
    throw new Error("injuredPersonIds is empty");
  }

  return {
    injuredPersonIds: [injuredIds[0]],

    // STEP 1
    transactionReceiveDate: form.transactionReceiveDate || null,
    transactionDeliveryDate: form.transactionDeliveryDate || null,

    // STEP 2
    militaryDoctorReceive: form.militaryDoctorReceive || null,
    militaryDoctorDelivery: form.militaryDoctorDelivery || null,
    verificationReceive: form.verificationReceive || null,
    verificationSendDate: form.verificationSendDate || null,
    directorpprovalSendDate: form.directorpprovalSendDate || null,
    directorpprovalReceive: form.directorpprovalReceive || null,

    // STEP 3
    verificationStatus: form.verificationStatus,
    finalStatus: form.finalStatus,
    isReturn: form.isReturn,
    returnPercentage: form.isReturn === 1 ? form.returnPercentage : null,
    returnDate: form.isReturn === 1 ? form.returnDate : null,

    notes: form.notes || null,
    situations: form.situations
      .filter((s) => s.situationName || s.situationNumber)
      .map((s) => ({
        situationNumber: s.situationNumber,
        situationName: s.situationName,
      })),
  };
};

const isSending = ref(false);

const saveStep = async () => {
  if (isSending.value) return;
  isSending.value = true;

  const payload = buildPayload();

  try {
    if (form.id) {
      await updateAuditingAndData(form.id, payload);
    } else {
      const res = await addAuditingAndData(payload);
      form.id = res.data.id;
    }

    modal.hide();
    await load();
    successAlert("تم إرسال بنجاح");
  } catch (e) {
    console.error(e);
    errorAlert("حدث خطأ أثناء الإرسال");
  } finally {
    isSending.value = false;
  }
};

const loadingExisting = ref(false);

const loadExistingAuditing = async (injuredPersonId) => {
  loadingExisting.value = true;

  const res = await getAuditingAndData({
    injuredPersonIds: [injuredPersonId],
    pageNumber: 1,
    pageSize: 1,
  });

  const existing = res.data.data?.[0];
  if (!existing) {
    loadingExisting.value = false;
    return;
  }

  Object.assign(form, {
    id: existing.id,
    transactionReceiveDate: existing.transactionReceiveDate?.slice(0, 10) || "",
    transactionDeliveryDate:
      existing.transactionDeliveryDate?.slice(0, 10) || "",
    militaryDoctorReceive: existing.militaryDoctorReceive?.slice(0, 10) || "",
    militaryDoctorDelivery: existing.militaryDoctorDelivery?.slice(0, 10) || "",
    verificationReceive: existing.verificationReceive?.slice(0, 10) || "",
    verificationSendDate: existing.verificationSendDate?.slice(0, 10) || "",
    directorpprovalSendDate:
      existing.directorpprovalSendDate?.slice(0, 10) || "",
    directorpprovalReceive: existing.directorpprovalReceive?.slice(0, 10) || "",
    verificationStatus: existing.verificationStatus ?? 0,
    finalStatus: existing.finalStatus ?? 0,
    isReturn: existing.isReturn ?? 0,
    returnPercentage: existing.returnPercentage || "",
    returnDate: existing.returnDate?.slice(0, 10) || "",
    notes: existing.notes || "",
    situations: existing.situations?.length
      ? JSON.parse(JSON.stringify(existing.situations))
      : [{ situationNumber: "1", situationName: "" }],
  });

  loadingExisting.value = false;
};

// ==============================
//  Modal عرض كل أسماء الجرحى
// ==============================
const allNames = ref([]);
const namesModal = ref(null);
let namesModalInstance = null;

const openNamesModal = (names) => {
  allNames.value = names;
  namesModalInstance.show();
};

const closeNamesModal = () => {
  namesModalInstance.hide();
};

const stats = ref({
  additionalData: {
    completedCount: 0,
    apologyCount: 0,
    notCompletedCount: 0,
    isReturnFalseCount: 0,
    isReturnTrueCount: 0,
    verifiedCount: 0,
    notVerifiedCount: 0,
    returnCount: 0,
    assistantOfficeCount: 0,
    waitingCount: 0,
  },
});

const totalFromAdditional = computed(() => {
  const a = stats.value.additionalData;
  return (
    a.completedCount + a.apologyCount + a.notCompletedCount + a.waitingCount
  );
});

const loadStats = async () => {
  try {
    const res = await getAuditingAndData();

    stats.value.additionalData = res.data.additionalData || {
      completedCount: 0,
      apologyCount: 0,
      notCompletedCount: 0,
      isReturnFalseCount: 0,
      isReturnTrueCount: 0,
      verifiedCount: 0,
      notVerifiedCount: 0,
      returnCount: 0,
      assistantOfficeCount: 0,
      waitingCount: 0,
    };
  } catch (e) {
    console.error(e);
  }
};

import { watch } from "vue";

watch(
  () => form.injuredPersonIds?.[0],
  (newInjuredId) => {
    if (!newInjuredId) return;

    // 🔍 نبحث هل هذا الجريح عنده سجل سابق
    const existing = list.value.find((x) => x.injuredPersonId === newInjuredId);

    // ✅ إذا ما عنده سجل → Auto Date
    if (!existing) {
      form.transactionReceiveDate = today();
    }
  },
  { immediate: true }
);

// ===== INIT =====
onMounted(() => {
  modal = new Modal(modalEl.value);
  transferModal = new Modal(transferModalEl.value);
  viewModal = new Modal(viewModalEl.value);
  situationsModal = new Modal(situationsModalEl.value);
  namesModalInstance = new Modal(namesModal.value);
  load();
  loadDepartments();
  loadStats();
});
</script>

<style scoped>
.situations-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 14px;
  border-radius: 12px;
}

.situation-chip {
  display: flex;
  gap: 8px;
  align-items: center;
  background: white;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d7de;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

.situation-chip:hover {
  border-color: #12b1d1;
  box-shadow: 0 3px 8px rgba(18, 177, 209, 0.15);
}

.chip-input {
  border: none;
  outline: none;
  background: transparent;
}

.chip-input.number {
  width: 55px;
  text-align: center;
  font-weight: 600;
  color: #12b1d1;
}

.chip-input.name {
  flex: 1;
}

.chip-remove {
  border: none;
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
  border-radius: 8px;
  padding: 6px 9px;
  transition: 0.2s;
}

.chip-remove:hover {
  background: #dc3545;
  color: white;
}

.chip-add {
  border: none;
  background: #12b1d1;
  color: white;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  align-self: flex-start;
  transition: 0.2s;
}

.chip-add:hover {
  background: #0e90ab;
}

.custom-table thead th {
  /* background: #f8fdff; */
  color: #222;
  font-weight: 700;
  padding: 14px;
  white-space: nowrap;
  border-bottom: 2px solid #d7e6ee !important;
}

.custom-table td {
  /* padding: 14px 10px; */
  vertical-align: middle;
  font-size: 15px;
  white-space: nowrap;
}

.custom-table tbody tr {
  border-bottom: 1px solid #ecf3f7;
}

.custom-table tbody tr:last-child {
  border-bottom: none;
}

.table-responsive {
  overflow-x: auto;
  padding-bottom: 8px;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #12b1d1;
  border-radius: 12px;
}

.badge.bg-info {
  background: #11b2d2 !important;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 20px;
}

.situation-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #f8fcff;
  border: 1px solid #d7ecf3;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  transition: 0.2s;
}

.situation-item:hover {
  background: #eefaff;
  border-color: #12b1d1;
}

.s-number {
  min-width: 40px;
  height: 40px;
  background: #12b1d1;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 3px 8px rgba(18, 177, 209, 0.25);
}

.s-content {
  flex: 1;
}

.s-title {
  font-weight: 600;
  color: #333;
  line-height: 1.5;
}

.s-content label {
  font-weight: 600;
  color: #0f6c88;
  display: block;
  margin-bottom: 4px;
}

.s-content p {
  margin: 0;
  color: #333;
  line-height: 1.6;
  word-break: break-word;
}

.situations-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.situation-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #f9fbfc;
  border: 1px solid #e5eaf0;
  border-radius: 14px;
  padding: 14px;
  transition: box-shadow 0.2s ease;
}

.situation-item:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.s-number {
  min-width: 40px;
  height: 40px;
  background: #12b1d1;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 3px 8px rgba(18, 177, 209, 0.25);
}

.s-content {
  flex: 1;
}

.s-title {
  font-weight: 600;
  color: #12b1d1;
  margin-bottom: 6px;
}

.s-name {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}
</style>
