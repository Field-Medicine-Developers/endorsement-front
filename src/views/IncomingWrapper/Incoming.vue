<template>
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
        <h2 class="h5 fw-bold m-2">سجل الوارد</h2>
        <small class="text-muted">عرض وإدارة معاملات الوارد</small>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button type="button" class="btn btn-primary" @click="openAdd()">
        إضافة وارد جديد
      </button>
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
                <th>اسم الجريح</th>
                <th>عدد الوارد</th>
                <th>تاريخ الوارد</th>
                <th>عدد الكتاب</th>
                <th>تاريخ الكتاب</th>
                <th>القيادة / التشكيل</th>
                <th>الموضوع</th>
                <th>المحتوى</th>
                <th>هامش مدير القسم</th>
                <!-- <th>تاريخ هامش مدير القسم</th> -->
                <th>هامش مسوؤل الشعبة</th>
                <th>الملحقات الطبية</th>
                <th>عدد صفحات المرفقات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(inc, idx) in incomingList" :key="inc.id">
                <td>
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      :value="inc.id"
                      v-model="selectedDepartmentIds"
                    />
                    <span></span>
                  </label>
                </td>
                <td>{{ (page - 1) * pageSize + idx + 1 }}</td>
                <td>
                  <div>
                    <div
                      v-for="(name, i) in inc.injuredNames.slice(0, 2)"
                      :key="i"
                    >
                      • {{ name }}
                    </div>
                    <!-- زر عرض الكل -->
                    <div
                      v-if="inc.injuredNames.length > 2"
                      class="show-more"
                      @click="openNamesModal(inc.injuredNames)"
                    >
                      عرض الكل ({{ inc.injuredNames.length }})
                    </div>
                  </div>
                </td>
                <td>{{ inc.incomingBookNumber }}</td>
                <td>{{ formatDate(inc.incomingDate) }}</td>
                <td>{{ inc.bookCount ?? "—" }}</td>
                <td>{{ formatDate(inc.bookDate) }}</td>
                <td>
                  <div class="fw-bold">{{ inc.commandName || "—" }}</div>
                  <small class="text-muted"> {{ inc.formationName }}</small>
                </td>
                <td>{{ inc.subject || "—" }}</td>
                <td>{{ inc.content || "—" }}</td>
                <td>
                  <button
                    class="btn btn-search btn-sm"
                    @click="openManagerNotes(inc.managerNotes || [])"
                  >
                    عرض الهوامش ({{ inc.managerNotes?.length || 0 }})
                  </button>
                </td>

                <!-- <td>{{ formatDate(inc.managerNoteDate) }}</td> -->
                <td>{{ inc.managerNoteDivision || "—" }}</td>
                <td>{{ medicalAccessoriesText(inc.medicalAccessories) }}</td>
                <td>{{ inc.archiveIncoming?.paginationCount ?? "—" }}</td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- تعديل -->
                    <button
                      v-role="[0, 1]"
                      class="button-edit"
                      @click="openEdit(inc)"
                    >
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
                    <button v-role="[0]" class="button" @click="remove(inc.id)">
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
                    <!-- عرض المرفقات -->
                    <button
                      class="button-archive"
                      title="عرض المرفقات"
                      @click="openArchive(inc)"
                    >
                      <svg class="svgIcon" viewBox="0 0 512 512">
                        <path
                          d="M424.4 214.7L253.1 386c-35.2 35.2-92.3 35.2-127.5 0
                             s-35.2-92.3 0-127.5L300.3 83.9c23.4-23.4 61.4-23.4
                             84.9 0s23.4 61.4 0 84.9L224.6 329.4c-11.7 11.7-30.7
                             11.7-42.4 0s-11.7-30.7 0-42.4L318.1 151c6.2-6.2
                             6.2-16.4 0-22.6s-16.4-6.2-22.6 0L159.6 264.3
                             c-23.4 23.4-23.4 61.4 0 84.9s61.4 23.4 84.9 0
                             l160.6-160.6c35.2-35.2 35.2-92.3 0-127.5
                             s-92.3-35.2-127.5 0L106.3 232.4"
                        />
                      </svg>
                    </button>

                    <!-- إضافة مرفقات -->
                    <!-- <button
                      class="button-archive-add"
                      title="إضافة مرفقات"
                      @click="openArchiveUpload(inc)"
                    >
                      <i class="bi bi-cloud-upload"></i>
                    </button> -->
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
          <h5 class="modal-title fw-bold primary">
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
                <label class="form-label">القيادة</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.commandId"
                    :options="commands"
                    label="label"
                    :reduce="(c) => c.value"
                    placeholder="اختر القيادة..."
                    searchable
                  />
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
                    placeholder="اختر التشكيل..."
                    :disabled="!form.commandId"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">عدد الوارد</label>
                <input
                  v-model.number="form.incomingBookNumber"
                  type="number"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label d-flex align-items-center gap-1">
                  تاريخ الوارد
                  <i
                    class="bi bi-info-circle-fill text-warning"
                    data-bs-toggle="tooltip"
                    title="أدخل اليوم ثم الشهر ثم السنة"
                    style="cursor: pointer"
                  ></i>
                </label>

                <input
                  type="text"
                  class="form-control"
                  title="أدخل اليوم ثم الشهر ثم السنة"
                  v-model="incomingDateText"
                  placeholder="أدخل اليوم ثم الشهر ثم السنة"
                  @input="normalizeIncomingDate"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">عدد الكتاب</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="form.bookCount"
                  min="0"
                  placeholder="أدخل عدد الكتاب"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label d-flex align-items-center gap-1">
                  تاريخ الكتاب

                  <!-- أيقونة تنبيه -->
                  <i
                    class="bi bi-info-circle-fill text-warning"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="أدخل اليوم ثم الشهر ثم السنة"
                    style="cursor: pointer"
                  ></i>
                </label>

                <input
                  type="text"
                  class="form-control"
                  placeholder="أدخل اليوم ثم الشهر ثم السنة"
                  v-model="bookDateText"
                  @input="normalizeBookDate"
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
              <div class="col-md-6">
                <label class="form-label">الملحقات الطبية</label>
                <div class="custom-vue-select-container">
                  <VueSelect
                    v-model="form.medicalAccessories"
                    :options="medicalAccessoriesOptions"
                    label="label"
                    :reduce="(o) => o.value"
                    placeholder="اختر نوع المرفق..."
                    searchable
                    clearable
                  />
                </div>
              </div>
              <!-- <div class="col-6">
                <label class="form-label">هامش مدير القسم</label>
                <input v-model="form.content" rows="3" class="form-control" />
                   </div> -->
              <!-- <div class="col-md-6">
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

  <!-- Advanced Search Modal -->
  <div class="modal fade" ref="advancedModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">بحث متقدم</h5>
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
          <h5 class="modal-title fw-bold primary">ترحيل المعاملة</h5>
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

            <!-- <div class="col-md-12">
              <label class="form-label">إرفاق ملفات</label>
              <input
                type="file"
                multiple
                @change="handleFiles"
                class="form-control"
              />
            </div> -->

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
          <button
            class="btn btn-add"
            :class="{ 'btn-saving': isTransferring }"
            :disabled="isTransferring"
            @click="submitTransfer"
          >
            <span
              v-if="isTransferring"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            {{ isTransferring ? "جارٍ الترحيل..." : "تحويل" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- View Modal -->
  <div class="modal fade" ref="viewModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">عرض تفاصيل الوارد</h5>
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
              <label class="form-label">عدد الوارد</label>
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

            <div class="col-md-6">
              <label class="form-label">عدد الكتاب</label>
              <input class="form-control" :value="view.bookCount" disabled />
            </div>

            <div class="col-md-6">
              <label class="form-label">تاريخ الكتاب</label>
              <input
                class="form-control"
                :value="view.bookDate ? view.bookDate.split('T')[0] : ''"
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

  <!-- Names Modal (عرض كل الأسماء) -->
  <div class="modal fade" tabindex="-1" ref="namesModal">
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

  <!-- Archive Modal -->
  <div class="modal fade" ref="archiveModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-folder2-open me-1"></i>
            مرفقات الوارد
          </h5>
        </div>

        <div class="modal-body">
          <!-- لا توجد مرفقات -->
          <div
            v-if="archiveFiles.length === 0"
            class="text-muted text-center py-4"
          >
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            لا توجد مرفقات
          </div>

          <!-- قائمة المرفقات -->
          <div v-else class="list-group">
            <button
              v-for="(file, i) in archiveFiles"
              :key="i"
              class="list-group-item list-group-item-action d-flex align-items-center gap-2"
              @click="openFile(file.fileFullUrl)"
            >
              <i class="bi bi-file-earmark-pdf text-danger fs-5"></i>
              <span class="flex-grow-1">
                {{ file.fileName }}
              </span>
              <i class="bi bi-box-arrow-up-right text-muted"></i>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchive()">إغلاق</button>
          <button class="btn btn-primary" @click="openArchiveUploadFromView">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Archive Upload Modal -->
  <div class="modal fade" ref="archiveUploadModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold primary">
            <i class="bi bi-cloud-upload me-1"></i>
            إضافة مرفقات
          </h5>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div
            v-for="(item, index) in archiveInputs"
            :key="index"
            class="d-flex gap-2 align-items-center mb-2"
          >
            <!-- Input -->
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              class="form-control"
              @change="onArchiveFilesSelected($event, index)"
            />
            <!-- حذف -->
            <button
              v-if="archiveInputs.length > 1"
              class="btn btn-outline-danger"
              @click="removeArchiveInput(index)"
              title="حذف"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button class="btn btn-search w-100 mt-3" @click="addArchiveInput">
            <i class="bi bi-plus-lg me-1"></i>
            إضافة مرفق آخر
          </button>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-light" @click="closeArchiveUpload">
            إلغاء
          </button>
          <button class="btn btn-primary" @click="submitArchiveUpload">
            رفع
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
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { Modal } from "bootstrap";
import { computed } from "vue";
import VueSelect from "vue3-select";
import { useRouter } from "vue-router";
import { Tooltip } from "bootstrap";
import { watch } from "vue";
import {
  successAlert,
  errorAlert,
  confirmDelete,
  confirmAction,
} from "@/utils/alert.js";
import { getDepartments } from "@/services/departments.service.js";
import { getFormations, getCommands } from "@/services/formations.service.js";
import {
  getIncomings,
  addIncoming,
  updateIncoming,
  deleteIncoming,
  transferIncoming,
} from "@/services/incoming.service.js";
import { uploadIncomingArchive } from "@/services/incoming-archive.service.js";

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
const commands = ref([]);
const bookDateText = ref("");
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

const medicalAccessoriesOptions = [
  { label: "أشعة ", value: 0 },
  { label: "سونار", value: 1 },
  { label: "رنين", value: 2 },
  { label: "قرص (CD)", value: 3 },
];

const tempName = ref("");
const inputRef = ref(null);

const addTag = (newTag) => {
  newTag = newTag.trim();
  if (!newTag) return;
  form.injuredNames.push(newTag);
};

const manualAddTag = async () => {
  if (!tempName.value.trim()) return;
  addTag(tempName.value);
  tempName.value = "";
  await nextTick();
  inputRef.value?.focus();
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
  commandId: null,
  incomingBookNumber: null,
  incomingDate: "",
  subject: "",
  content: "",
  departmentIds: [],
  medicalAccessories: null,
  bookCount: "",
  bookDate: null,
});
console.log(commands.value);

const openAdd = () => ((editMode.value = false), reset(), modal.show());

const openEdit = (item) => {
  editMode.value = true;
  form.id = item.id;
  form.injuredNames = item.injuredNames || [];
  form.formationId = item.formationId;
  form.commandId = item.commandId;
  form.incomingBookNumber = item.incomingBookNumber;
  form.incomingDate = item.incomingDate
    ? item.incomingDate.substring(0, 10)
    : null;
  incomingDateText.value = item.incomingDate
    ? item.incomingDate.substring(8, 10) +
      item.incomingDate.substring(5, 7) +
      item.incomingDate.substring(0, 4)
    : "";
  form.subject = item.subject;
  form.content = item.content;
  form.departmentIds = item.departmentIds || [];
  form.medicalAccessories = item.medicalAccessories;
  form.bookCount = item.bookCount;
  form.bookDate = item.bookDate ? item.bookDate.split("T")[0] : null;
  bookDateText.value = form.bookDate
    ? form.bookDate.substring(8, 10) +
      form.bookDate.substring(5, 7) +
      form.bookDate.substring(0, 4)
    : "";
  modal.show();
};

const isSaving = ref(false);
const save = async () => {
  // منع الضغط المتكرر
  if (isSaving.value) return;
  //  تحقق قبل أي شيء
  normalizeBookDate();
  //  تحقق منطقي كافي
  if (!form.bookDate) {
    errorAlert("يرجى إدخال تاريخ الكتاب بصيغة صحيحة (يوم / شهر / سنة)");
    return;
  }
  if (!form.incomingDate) {
    errorAlert("يرجى إدخال تاريخ الوارد بصيغة صحيحة (يوم / شهر / سنة)");
    return;
  }
  //  منع الإرسال إذا لم يتم إدخال تاريخ
  if (!form.bookDate) {
    errorAlert("يرجى إدخال تاريخ الكتاب بشكل صحيح قبل الحفظ");
    return;
  }

  isSaving.value = true;

  try {
    const payload = {
      ...form,
      bookDate: form.bookDate,
    };

    if (!editMode.value) {
      await addIncoming(payload);
      successAlert("تمت الإضافة بنجاح");
    } else {
      await updateIncoming(form.id, payload);
      successAlert("تم التعديل بنجاح");
    }

    modal.hide();
    await load();
  } catch (e) {
    console.error("خطأ بالحفظ", e);
    errorAlert("فشل الحفظ");
  } finally {
    isSaving.value = false;
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
  form.medicalAccessories = null;
  form.bookCount = "";
  form.bookDate = null;
  bookDateText.value = "";
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

const isTransferring = ref(false);
const submitTransfer = async () => {
  if (isTransferring.value) return;

  if (!transfer.departmentId) {
    errorAlert("يرجى اختيار الشعبة المراد الترحيل إليها.");
    return;
  }

  if (!isBulkTransfer.value && !transfer.incomingId) {
    errorAlert("لم يتم تحديد معاملة للترحيل.");
    return;
  }

  if (isBulkTransfer.value && selectedDepartmentIds.value.length === 0) {
    errorAlert("لم يتم تحديد أي معاملة.");
    return;
  }

  isTransferring.value = true;

  try {
    // ===============================
    // 🔹 ترحيل جماعي
    // ===============================
    if (isBulkTransfer.value) {
      for (const incId of selectedDepartmentIds.value) {
        const fd = new FormData();
        fd.append("IncomingId", incId);
        fd.append("DepartmentId", transfer.departmentId);

        if (transfer.notes) {
          fd.append("Notes", transfer.notes);
        }

        if (transfer.files.length > 0) {
          transfer.files.forEach((f) => fd.append("files", f));
        }

        await transferIncoming(fd);
      }

      successAlert(
        `تم ترحيل (${selectedDepartmentIds.value.length}) معاملات بنجاح`
      );

      // تنظيف التحديد
      selectedDepartmentIds.value = [];
      selectAll.value = false;
    }

    // ===============================
    // 🔹 ترحيل مفرد
    // ===============================
    else {
      const fd = new FormData();
      fd.append("IncomingId", transfer.incomingId);
      fd.append("DepartmentId", transfer.departmentId);

      if (transfer.notes) {
        fd.append("Notes", transfer.notes);
      }

      if (transfer.files.length > 0) {
        transfer.files.forEach((f) => fd.append("files", f));
      }

      await transferIncoming(fd);

      successAlert("تم ترحيل المعاملة بنجاح");
    }

    modalTransfer.hide();
    load();
  } catch (e) {
    console.error("خطأ في الترحيل", e);
    errorAlert("حدث خطأ أثناء الترحيل أو أن المعاملة مُرحلة مسبقاً");
  } finally {
    isTransferring.value = false;
    isBulkTransfer.value = false;
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
  view.bookCount = inc.bookCount;
  view.bookDate = inc.bookDate;
  modalView.show();
};
const closeView = () => modalView.hide();

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

const archiveModal = ref(null);
const archiveUploadModal = ref(null);

let modalArchive = null;
let modalArchiveUpload = null;

const archiveFiles = ref([]);
const currentIncomingId = ref("");
const selectedArchiveFiles = ref([]);

/*   open Archive */
const openArchive = (inc) => {
  document.activeElement?.blur();
  currentIncomingId.value = inc.id;

  archiveFiles.value = inc.archiveIncoming?.items ?? [];

  modalArchive.show();
};

const openArchiveUploadFromView = () => {
  modalArchive.hide();
  modalArchiveUpload.show();
};

const archiveInputRef = ref(null);
const archiveInputs = ref([{ files: [] }]);
const closeArchive = () => modalArchive.hide();

const openArchiveUpload = (inc) => {
  document.activeElement?.blur();
  currentIncomingId.value = inc.id;
  selectedArchiveFiles.value = [];
  modalArchiveUpload.show();
};

const openArchiveDirect = (inc) => {
  if (!inc.archiveIncoming || inc.archiveIncoming.length === 0) {
    return errorAlert("لا توجد مرفقات لهذا الوارد");
  }

  inc.archiveIncoming.forEach((f) => {
    window.open(f.fileFullUrl, "_blank");
  });
};

const closeArchiveUpload = () => modalArchiveUpload.hide();

const onArchiveFilesSelected = (event, index) => {
  archiveInputs.value[index].files = Array.from(event.target.files);
};

const submitArchiveUpload = async () => {
  if (!currentIncomingId.value) {
    return errorAlert("معاملة غير محددة");
  }

  // جمع كل الملفات
  const allFiles = archiveInputs.value.flatMap((x) => x.files);

  if (allFiles.length === 0) {
    return errorAlert("يرجى اختيار ملفات");
  }

  try {
    await uploadIncomingArchive(currentIncomingId.value, allFiles);

    successAlert("تم رفع المرفقات بنجاح");
    archiveInputs.value = [{ files: [] }];
    currentIncomingId.value = "";

    modalArchiveUpload.hide();
    load();
  } catch (e) {
    console.error(e);
    errorAlert("فشل رفع المرفقات");
  }
};

const removeArchiveInput = (index) => {
  archiveInputs.value.splice(index, 1);
};

const addArchiveInput = () => {
  archiveInputs.value.push({ files: [] });
};

const openFile = (url) => {
  window.open(url, "_blank");
};

const medicalAccessoriesText = (value) => {
  switch (value) {
    case 0:
      return "أشعة ";
    case 1:
      return "سونار";
    case 2:
      return "فحوصات";
    case 3:
      return "قرص (CD)";
    case null:
    case undefined:
      return "—";
    default:
      return "غير معروف";
  }
};

const loadCommands = async () => {
  const res = await getCommands();
  console.log("Commands response:", res.data);
  commands.value = res.data.data.map((c) => ({
    label: c.name,
    value: c.id,
    formations: c.formations,
  }));
};

watch(
  () => form.commandId,
  (commandId) => {
    if (!commandId) {
      formations.value = [];
      form.formationId = null;
      return;
    }
    const selectedCommand = commands.value.find((c) => c.value === commandId);
    formations.value = selectedCommand?.formations ?? [];
    form.formationId = null;
  }
);

const parseDateNoLeadingZero = (text) => {
  if (!text) return null;
  // يسمح فقط أرقام و /
  const parts = text.split("/");
  if (parts.length !== 3) return null;
  const [dayStr, monthStr, yearStr] = parts;

  //  منع 0 أو 01 أو 02
  if (dayStr.startsWith("0") || monthStr.startsWith("0")) return null;

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  )
    return null;

  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  )
    return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

const normalizeBookDate = () => {
  form.bookDate = parseDateNoLeadingZero(bookDateText.value);
};

const incomingDateText = ref("");
const normalizeIncomingDate = () => {
  form.incomingDate = parseDateNoLeadingZero(incomingDateText.value);
};

const selectedDepartmentIds = ref([]);
const selectAll = ref(false);

// تحديد / إلغاء تحديد الكل
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedDepartmentIds.value = incomingList.value.map((x) => x.id);
  } else {
    selectedDepartmentIds.value = [];
  }
};

// مزامنة checkbox "تحديد الكل"
watch(selectedDepartmentIds, () => {
  selectAll.value =
    selectedDepartmentIds.value.length === incomingList.value.length &&
    incomingList.value.length > 0;
});

const bulkTransfer = async () => {
  if (selectedDepartmentIds.value.length === 0) {
    errorAlert("لم يتم تحديد أي عنصر");
    return;
  }

  const confirm = await confirmAction(
    "تأكيد الترحيل",
    `هل تريد ترحيل (${selectedDepartmentIds.value.length}) معاملات إلى الوحدة المحددة؟`
  );
  if (!confirm.isConfirmed) return;
  isTransferring.value = true;
  try {
    for (const incId of selectedDepartmentIds.value) {
      const fd = new FormData();
      fd.append("IncomingId", incId);
      fd.append("DepartmentId", transfer.departmentId);

      await transferIncoming(fd);
    }
    successAlert("تم ترحيل المعاملات المحددة بنجاح");
    selectedDepartmentIds.value = [];
    selectAll.value = false;
    load();
  } catch (e) {
    console.error(e);
    errorAlert("حدث خطأ أثناء الترحيل");
  } finally {
    isTransferring.value = false;
  }
};

const isBulkTransfer = ref(false);
const openBulkTransfer = async () => {
  if (selectedDepartmentIds.value.length === 0) {
    errorAlert("لم يتم تحديد أي معاملة");
    return;
  }

  const confirm = await confirmAction(
    "تأكيد الترحيل",
    `هل تريد ترحيل (${selectedDepartmentIds.value.length}) عناصر إلى القسم المحدد؟`
  );

  if (!confirm.isConfirmed) return;

  isBulkTransfer.value = true;
  transfer.incomingId = "";
  transfer.departmentId = null;
  transfer.notes = "";
  transfer.files = [];
  modalTransfer.show();
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

onMounted(() => {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  modal = new Modal(modalEl.value);
  modalAdv = new Modal(advancedModal.value);
  modalTransfer = new Modal(transferModal.value);
  modalView = new Modal(viewModal.value);
  namesModalInstance = new Modal(namesModal.value);
  modalArchive = new Modal(archiveModal.value);
  modalArchiveUpload = new Modal(archiveUploadModal.value);
  if (managerNotesModalEl.value) {
    managerNotesModal = new Modal(managerNotesModalEl.value);
  }
  load();
  loadDepartments();
  loadFormations();
  loadCommands();
});
</script>
