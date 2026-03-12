<template>
  <div class="dashboard container-fluid mt-0">
    <!-- Appbar -->
    <div
      class="appbar rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center gap-2">
        <span
          class="appbar-icon d-inline-flex align-items-center justify-content-center"
        >
          <i class="bi bi-clipboard2-pulse"></i>
        </span>
        <div>
          <h2 class="h5 fw-bold m-2">لوحة التحكم</h2>
          <!-- <small class="text-muted">
            عرض الاحصائيات مع تتبع تأييدات الجرحى
          </small> -->
        </div>
      </div>

      <div class="btn-wrapper">
        <button
          class="btn-search w-100"
          data-bs-toggle="modal"
          data-bs-target="#achievementsModal"
          @click="loadAchievements"
        >
          <i class="bi bi-bar-chart"></i>
          عرض إحصائيات الإنجاز
        </button>
      </div>
    </div>

    <!-- Incoming Tracking Card -->
    <div class="card shadow-sm border-0 mb-4 p-4 track-card">
      <div class="d-flex align-items-center mb-3 gap-2">
        <span class="track-icon">
          <i class="bi bi-arrow-repeat"></i>
        </span>
        <h5 class="fw-bold mb-0 track-title">تتبع الوارد</h5>
      </div>

      <div class="row g-3 align-items-end">
        <div class="col-lg-4 col-md-6 col-12">
          <label class="form-label fw-semibold">اسم الجريح</label>
          <input
            v-model="trackForm.injuredName"
            class="form-control"
            placeholder="اكتب اسم الجريح"
            @keyup.enter="track"
          />
        </div>

        <div class="col-lg-3 col-md-6 col-12">
          <label class="form-label fw-semibold">رقم الكتاب</label>
          <input
            v-model="trackForm.incomingBookNumber"
            class="form-control"
            placeholder="رقم كتاب (اختياري)"
            @keyup.enter="track"
          />
        </div>

        <div class="col-lg-3 col-md-6 col-12">
          <div class="custom-vue-select-container">
            <label class="form-label fw-semibold">النوع</label>
            <VueSelect
              v-model="trackForm.typeName"
              :options="typeOptions"
              label="label"
              :reduce="(o) => o.value"
              placeholder="كل الأنواع"
              clearable
              appendToBody
            />
          </div>
        </div>

        <div class="col-lg-2 col-md-6 col-12">
          <button class="btn btn-search w-100 track-btn" @click="track">
            <i class="bi bi-search ms-1"></i>
            تتبع
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="spinner-wrapper">
      <div class="spinner"></div>
    </div>

    <!-- Dashboard -->
    <div v-else class="modern-dashboard">
      <div class="dashboard-tabs">
        <button
          :class="{ active: activeSection === 'incoming' }"
          @click="activeSection = 'incoming'"
        >
          الوارد وأنواعه
        </button>

        <button
          :class="{ active: activeSection === 'finalAudit' }"
          @click="activeSection = 'finalAudit'"
        >
          الحالة النهائية والتدقيق
        </button>

        <button
          :class="{ active: activeSection === 'margin' }"
          @click="activeSection = 'margin'"
        >
          الهامش الإداري
        </button>

        <button
          :class="{ active: activeSection === 'landa' }"
          @click="activeSection = 'landa'"
        >
          شعبة الإدارة
        </button>

        <button
          :class="{ active: activeSection === 'generalStats' }"
          @click="activeSection = 'generalStats'"
        >
          الإحصائيات العامة
        </button>
      </div>

      <div class="soft-card dashboard-filter-card">
        <div class="dashboard-filter-head">
          <div>
            <h5>فلترة الإحصائيات</h5>
            <!-- <p>تحديث بيانات لوحة التحكم حسب المدة الزمنية</p> -->
          </div>

          <!-- <div class="filter-head-icon">
      <i class="bi bi-funnel"></i>
    </div> -->
        </div>

        <div class="row g-3 align-items-end">
          <div class="col-lg-4 col-md-6 col-12">
            <label class="form-label fw-semibold">من تاريخ</label>
            <div class="filter-input-wrap">
              <span class="filter-input-icon">
                <i class="bi bi-calendar-event"></i>
              </span>
              <input
                type="date"
                class="form-control filter-control"
                v-model="dashboardFilter.dateFrom"
              />
            </div>
          </div>

          <div class="col-lg-4 col-md-6 col-12">
            <label class="form-label fw-semibold">إلى تاريخ</label>
            <div class="filter-input-wrap">
              <span class="filter-input-icon">
                <i class="bi bi-calendar-check"></i>
              </span>
              <input
                type="date"
                class="form-control filter-control"
                v-model="dashboardFilter.dateTo"
              />
            </div>
          </div>

          <div class="col-lg-4 col-md-12 col-12">
            <div class="filter-actions">
              <button
                class="btn-search filter-btn flex-fill"
                @click="loadDashboardStats"
              >
                <i class="bi bi-funnel ms-1"></i>
                فلترة
              </button>

              <button
                class="btn-reset-filter flex-fill"
                @click="resetDashboardFilter"
              >
                <i class="bi bi-arrow-counterclockwise ms-1"></i>
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      </div>
      <Transition name="section-fade" mode="out-in">
        <section v-if="activeSection === 'incoming'" class="dashboard-section">
          <div class="summary-grid three-cols">
            <div class="soft-card summary-card primary-card reveal-card">
              <div class="summary-icon">
                <i class="bi bi-inbox"></i>
              </div>
              <div class="incoming-total-content">
  <span class="incoming-total-label">الوارد الكلي</span>
  <h3 class="incoming-total-number">{{ stats.totalIncomingsCount }}</h3>
  <small class="incoming-total-note">إجمالي المعاملات الواردة</small>
</div>
            </div>

            <div class="soft-card summary-card reveal-card">
              <div class="summary-icon">
                <i class="bi bi-folder2-open"></i>
              </div>
              <div class="summary-content">
                <span class="summary-label">الوارد العام</span>
                <h3>{{ stats.generalIncomingsCount }}</h3>
                <small>المعاملات العامة</small>
              </div>
            </div>

            <div class="soft-card summary-card reveal-card">
              <div class="summary-icon">
                <i class="bi bi-lock"></i>
              </div>
              <div class="summary-content">
                <span class="summary-label">الوارد السري</span>
                <h3>{{ stats.secretIncomingsCount }}</h3>
                <small>المعاملات السرية</small>
              </div>
            </div>
          </div>

          <div class="row g-3 align-items-stretch">
            <div class="col-xl-6 col-12">
              <div
                class="soft-card incoming-types-card h-100 eveal-card eveal-card"
              >
                <div class="incoming-types-card-header">
                  <div class="incoming-types-card-title">
                    <span class="incoming-types-main-icon">
                      <i class="bi bi-diagram-3-fill"></i>
                    </span>
                    <div>
                      <h5>أنواع الوارد</h5>
                      <p>توزيع المعاملات حسب النوع</p>
                    </div>
                  </div>

                  <div class="incoming-types-total">
                    <small>الإجمالي</small>
                    <strong>
                      {{
                        stats.injuredIncomingsCount +
                        stats.employIncomingsCount +
                        stats.sickIncomingsCount +
                        stats.formalBookIncomingsCount
                      }}
                    </strong>
                  </div>
                </div>

                <div class="incoming-types-card-grid">
                  <div class="incoming-types-card-item">
                    <span class="incoming-item-icon">
                      <i class="bi bi-person-heart"></i>
                    </span>
                    <div class="incoming-item-content">
                      <small>جريح</small>
                      <strong>{{ stats.injuredIncomingsCount }}</strong>
                    </div>
                  </div>

                  <div class="incoming-types-card-item">
                    <span class="incoming-item-icon">
                      <i class="bi bi-person-badge"></i>
                    </span>
                    <div class="incoming-item-content">
                      <small>منتسب</small>
                      <strong>{{ stats.employIncomingsCount }}</strong>
                    </div>
                  </div>

                  <div class="incoming-types-card-item">
                    <span class="incoming-item-icon">
                      <i class="bi bi-heart-pulse"></i>
                    </span>
                    <div class="incoming-item-content">
                      <small>مريض</small>
                      <strong>{{ stats.sickIncomingsCount }}</strong>
                    </div>
                  </div>

                  <div class="incoming-types-card-item">
                    <span class="incoming-item-icon">
                      <i class="bi bi-file-earmark-text"></i>
                    </span>
                    <div class="incoming-item-content">
                      <small>كتاب رسمي</small>
                      <strong>{{ stats.formalBookIncomingsCount }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-6 col-12">
              <div class="soft-card analytics-card h-100 eveal-card">
                <div class="section-head">
                  <div>
                    <h5>أنواع الوارد</h5>
                    <p>عرض بياني لتوزيع الأنواع</p>
                  </div>
                </div>

                <div class="chart-wrap small-chart-wrap">
                  <canvas id="incomingTypeChart"></canvas>
                </div>

                <div class="mini-legend custom-legend">
                  <div><span class="dot dot-1"></span> جريح</div>
                  <div><span class="dot dot-2"></span> منتسب</div>
                  <div><span class="dot dot-3"></span> مريض</div>
                  <div><span class="dot dot-4"></span> كتاب رسمي</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Transition>
      <!-- زر : الحالة النهائية -->
      <Transition name="section-fade" mode="out-in">
        <section
          v-if="activeSection === 'finalAudit'"
          class="dashboard-section"
        >
          <div class="soft-card final-status-card eveal-card slide-up-card">
            <div class="final-status-header">
              <div class="final-status-title-wrap">
                <span class="final-status-icon">
                  <i class="bi bi-kanban-fill"></i>
                </span>
                <div>
                  <h5 class="final-status-title">الحالات النهائية للمعاملة</h5>
                  <p class="final-status-subtitle">
                    ملخص نهائي لحركة المعاملة داخل النظام
                  </p>
                </div>
              </div>

              <div class="final-status-total">
                <small>إجمالي الحالات</small>
                <strong>
                  {{
                    stats.finalStatusTypeCount.authenticationCount +
                    stats.finalStatusTypeCount.returnCount +
                    stats.finalStatusTypeCount.deputyOfficeCount +
                    stats.finalStatusTypeCount.sendingAlRaziCount +
                    stats.finalStatusTypeCount.healthOfIssuanceCount +
                    stats.finalStatusTypeCount.requestPrioritiesCount +
                    stats.finalStatusTypeCount.defaultCount +
                    stats.finalStatusTypeCount.authorizedAuthenticationCount
                  }}
                </strong>
              </div>
            </div>

            <div class="final-status-grid">
              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-circle"></i>
                </span>
                <div class="item-content">
                  <small>الافتراضي</small>
                  <strong>{{ stats.finalStatusTypeCount.defaultCount }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-patch-check-fill"></i>
                </span>
                <div class="item-content">
                  <small>المصادقة</small>
                  <strong>{{
                    stats.finalStatusTypeCount.authenticationCount
                  }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-person-check-fill"></i>
                </span>
                <div class="item-content">
                  <small>مكتب المعاون (المخول)</small>
                  <strong>{{
                    stats.finalStatusTypeCount.authorizedAuthenticationCount
                  }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-arrow-return-left"></i>
                </span>
                <div class="item-content">
                  <small>الإرجاع</small>
                  <strong>{{ stats.finalStatusTypeCount.returnCount }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-building"></i>
                </span>
                <div class="item-content">
                  <small>مكتب المعاون</small>
                  <strong>{{
                    stats.finalStatusTypeCount.deputyOfficeCount
                  }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-send-check"></i>
                </span>
                <div class="item-content">
                  <small>إرسال الرازي</small>
                  <strong>{{
                    stats.finalStatusTypeCount.sendingAlRaziCount
                  }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-shield-check"></i>
                </span>
                <div class="item-content">
                  <small>صحة الإصدار</small>
                  <strong>{{
                    stats.finalStatusTypeCount.healthOfIssuanceCount
                  }}</strong>
                </div>
              </div>

              <div class="final-status-item">
                <span class="item-icon">
                  <i class="bi bi-list-stars"></i>
                </span>
                <div class="item-content">
                  <small>الأولويات</small>
                  <strong>{{
                    stats.finalStatusTypeCount.requestPrioritiesCount
                  }}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3 align-items-stretch">
            <div class="col-xl-6 col-12">
              <div class="soft-card progress-card h-100">
                <div class="section-head mb-3">
                  <div>
                    <h5>التدقيق والبيانات</h5>
                    <p>نسبة التدقيق المنجز</p>
                  </div>
                </div>

                <div class="progress-info">
                  <div>
                    <span>مدقق</span>
                    <strong>{{
                      stats.auditingAndDataCount.verifiedCount
                    }}</strong>
                  </div>
                  <div>
                    <span>غير مدقق</span>
                    <strong>{{
                      stats.auditingAndDataCount.notVerifiedCount
                    }}</strong>
                  </div>
                  <div>
                    <span>الإجمالي</span>
                    <strong>{{ stats.auditingAndDataCount.totalCount }}</strong>
                  </div>
                </div>

                <div class="modern-progress">
                  <div
                    class="modern-progress-bar"
                    :style="{
                      width:
                        getPercent(
                          stats.auditingAndDataCount.verifiedCount,
                          stats.auditingAndDataCount.totalCount
                        ) + '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="col-xl-6 col-12">
              <div class="soft-card analytics-card h-100">
                <div class="section-head">
                  <div>
                    <h5>الحالة النهائية</h5>
                    <p>توزيع نهائي حسب حالة المعاملة</p>
                  </div>
                </div>

                <div class="chart-wrap chart-bar-wrap">
                  <canvas id="finalStatusChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Transition>
      <!-- زر : الهامش الإداري -->
 <section v-if="activeSection === 'margin'" class="dashboard-section">
  <div class="row g-3 align-items-stretch">
    <div class="col-lg-6 col-12">
      <div class="soft-card progress-card h-100">
        <div class="section-head mb-3">
          <div>
            <h5>الهامش الإداري</h5>
            <p>حالة إنجاز الملاحظات الإدارية</p>
          </div>
        </div>

        <div class="progress-info">
          <div>
            <span>منجز</span>
            <strong>{{ stats.marginNotesCount.withMarginNotesCount }}</strong>
          </div>
          <div>
            <span>غير منجز</span>
            <strong>{{ stats.marginNotesCount.withoutMarginNotesCount }}</strong>
          </div>
          <div>
            <span>الإجمالي</span>
            <strong>{{ stats.marginNotesCount.totalCount }}</strong>
          </div>
        </div>

        <div class="modern-progress">
          <div
            class="modern-progress-bar"
            :style="{
              width:
                getPercent(
                  stats.marginNotesCount.withMarginNotesCount,
                  stats.marginNotesCount.totalCount
                ) + '%',
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="col-lg-6 col-12">
      <div class="soft-card analytics-card h-100">
        <div class="section-head">
          <div>
            <h5>الهامش الإداري</h5>
            <p>عرض بياني لحالة الإنجاز</p>
          </div>
        </div>

        <div class="chart-wrap small-chart-wrap">
          <canvas id="marginChart"></canvas>
        </div>

        <div class="mini-legend custom-legend">
          <div><span class="dot dot-1"></span> منجز</div>
          <div><span class="dot dot-3"></span> غير منجز</div>
        </div>
      </div>
    </div>
  </div>
</section>
<Transition name="section-fade" mode="out-in">
      <!--  زر: شعبة الإدارة -->
      <section v-if="activeSection === 'landa'" class="dashboard-section">
        <div class="summary-grid three-cols">
          <div class="soft-card summary-card reveal-card">
            <div class="summary-icon">
              <i class="bi bi-diagram-3"></i>
            </div>
            <div class="summary-content">
              <span class="summary-label">الصادر الداخلي</span>
              <h3>{{ stats.landaIsExportCount.internalExportCount }}</h3>
              <small>عدد الصادر الداخلي</small>
            </div>
          </div>

          <div class="soft-card summary-card reveal-card">
            <div class="summary-icon">
              <i class="bi bi-box-arrow-up-left"></i>
            </div>
            <div class="summary-content">
              <span class="summary-label">الصادر الخارجي</span>
              <h3>{{ stats.landaIsExportCount.externalExportCount }}</h3>
              <small>عدد الصادر الخارجي</small>
            </div>
          </div>

          <div class="soft-card summary-card reveal-card">
            <div class="summary-icon">
              <i class="bi bi-life-preserver"></i>
            </div>
            <div class="summary-content">
              <span class="summary-label">إسناد الإصابات</span>
              <h3>{{ stats.injurySupportsCount }}</h3>
              <small>إجمالي الإسنادات</small>
            </div>
          </div>
        </div>

        <div class="row g-3 align-items-stretch">
          <div class="col-lg-6 col-12">
            <div class="soft-card progress-card h-100 reveal-card">
              <div class="section-head mb-3">
                <div>
                  <h5>شعبة الإدارة</h5>
                  <p>الإنجاز داخل الشعبة</p>
                </div>
              </div>

              <div class="progress-info">
                <div>
                  <span>منجز</span>
                  <strong>{{ stats.landaCount.achievedCount }}</strong>
                </div>
                <div>
                  <span>غير منجز</span>
                  <strong>{{ stats.landaCount.notAchievedCount }}</strong>
                </div>
                <div>
                  <span>الإجمالي</span>
                  <strong>{{ stats.landaCount.totalCount }}</strong>
                </div>
              </div>

              <div class="modern-progress">
                <div
                  class="modern-progress-bar"
                  :style="{
                    width:
                      getPercent(
                        stats.landaCount.achievedCount,
                        stats.landaCount.totalCount
                      ) + '%',
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-12">
            <div class="soft-card analytics-card h-100">
              <div class="section-head">
                <div>
                  <h5>شعبة الإدارة</h5>
                  <p>عرض بياني لحالة الإنجاز والصادر</p>
                </div>
              </div>

              <div class="chart-wrap chart-bar-wrap">
                <canvas id="landaChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Transition>
      <!-- زر الإحصائيات العامة -->
      <section
        v-if="activeSection === 'generalStats'"
        class="dashboard-section"
      >
        <!-- <div class="section-title-wrap">
          <h4 class="section-title">الإحصائيات العامة</h4>
          <p class="section-subtitle">نظرة عامة على أهم أرقام النظام</p>
        </div> -->

        <div class="soft-card analytics-card large-chart-card">
          <div class="section-head">
            <div>
              <h5>الإحصائيات العامة</h5>
              <p>مخطط عام لحركة النظام</p>
            </div>
            <!-- <span class="section-badge">Dashboard</span> -->
          </div>

          <div class="chart-wrap chart-line-wrap">
            <canvas id="mainStatsChart"></canvas>
          </div>
        </div>
      </section>
    </div>

    <!-- Track Result Modal -->
    <div class="modal fade" ref="trackModalEl" tabindex="-1">
      <div
        class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold primary">تفاصيل تتبع الوارد</h5>
          </div>

          <div class="modal-body track-modal-body">
            <div class="info-card">
              <div class="info-header">
                <i class="bi bi-folder2-open"></i>
                <h6>معلومات الوارد</h6>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <span>رقم الكتاب</span>
                  <strong>{{ trackResult.incomingBookNumber }}</strong>
                </div>

                <div class="info-item">
                  <span>التشكيل</span>
                  <strong>{{ trackResult.formationName }}</strong>
                </div>

                <div class="info-item">
                  <span>الجهة المرسلة</span>
                  <strong>{{ trackResult?.createdByUserName || "—" }}</strong>
                </div>

                <div class="info-item">
                  <span>الجهة الاصابة</span>
                  <strong>{{ trackResult.subject }}</strong>
                </div>
              </div>
            </div>

            <div v-if="trackResult.injuredNames.length" class="info-card">
              <div class="info-header">
                <i class="bi bi-people"></i>
                <h6>الأسماء المرتبطة</h6>
              </div>

              <div class="injured-tags">
                <span
                  v-for="(n, i) in trackResult.injuredNames"
                  :key="i"
                  class="injured-badge"
                >
                  <i class="bi bi-person-check"></i>
                  {{ n }}
                </span>
              </div>
            </div>

            <div v-if="trackResult.transfers.length" class="info-card">
              <div class="info-header">
                <i class="bi bi-arrow-left-right"></i>
                <h6>مسار التحويل</h6>
              </div>

              <ul class="timeline-modern">
                <li v-for="t in trackResult.transfers" :key="t.id">
                  <span class="timeline-dot"></span>
                  <div class="timeline-card">
                    <strong>{{ t.departmentName }}</strong>

                    <div class="timeline-meta">
                      المرحلة {{ t.stage }} · {{ formatDate(t.createdAt) }} ·
                      {{ t.createdByUserName }}
                    </div>

                    <div class="timeline-dates">
                      استلام: {{ formatDate(t.receiveDate) || "-" }} | تسليم:
                      {{ formatDate(t.deliveryDate) || "-" }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div v-if="trackResult.actions.length" class="info-card">
              <div class="info-header">
                <i class="bi bi-lightning"></i>
                <h6>هامش مسؤول القسم</h6>
              </div>

              <ul class="timeline-modern actions">
                <li v-for="(a, i) in trackResult.actions" :key="i">
                  <span class="timeline-dot action"></span>

                  <div class="timeline-card">
                    <strong>{{ a.description }}</strong>

                    <div class="timeline-meta">
                      {{ formatDate(a.actionDate) }} ·
                      {{ a.createdByUserName || "غير معروف" }}
                    </div>

                    <div
                      v-if="a.additionalInfo?.ManagerNote"
                      class="timeline-note"
                    >
                      <i class="bi bi-chat-left-text"></i>
                      {{ a.additionalInfo.ManagerNote }}
                    </div>

                    <div
                      v-if="a.actionType === 'StatusChange'"
                      class="timeline-status"
                    >
                      <div>
                        <strong>الحالة:</strong>
                        {{
                          a.additionalInfo?.Status === "Approved"
                            ? "موافق عليه"
                            : a.additionalInfo?.Status === "Rejected"
                            ? "مرفوض"
                            : a.additionalInfo?.Status || "-"
                        }}
                      </div>

                      <div v-if="a.additionalInfo?.ReceiveDate">
                        <strong>تاريخ الاستلام:</strong>
                        {{ a.additionalInfo.ReceiveDate }}
                      </div>

                      <div v-if="a.additionalInfo?.RejectionReason">
                        <strong>سبب الرفض:</strong>
                        {{ a.additionalInfo.RejectionReason }}
                      </div>

                      <div v-if="a.additionalInfo?.RejectionDate">
                        <strong>تاريخ الرفض:</strong>
                        {{ a.additionalInfo.RejectionDate }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-light"
                  @click="closeTrackModal"
                >
                  إغلاق
                </button>
              
          </div>
        </div>
      </div>
    </div>

    <!-- Achievements Modal -->
    <div
      class="modal fade"
      id="achievementsModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold primary">إحصائيات الإنجاز</h5>
          </div>

          <div class="modal-body">
            <div class="row g-3 mb-4 align-items-end">
              <div class="col-md-4 col-12">
                <label class="form-label fw-bold">السنة</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="achievementFilter.year"
                  placeholder="اكتب السنة"
                />
              </div>

              <div class="col-md-4 col-12">
                <label class="form-label fw-bold">الشهر</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="achievementFilter.month"
                  placeholder="اكتب الشهر"
                  min="1"
                  max="12"
                />
              </div>

              <div class="col-md-4 col-12">
                <label class="form-label fw-bold">اليوم</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="achievementFilter.day"
                  placeholder="اكتب اليوم"
                  min="1"
                  max="31"
                />
              </div>
            </div>

            <hr />

            <div v-if="achievementLoading" class="text-center py-5">
              <div class="spinner-border text-info"></div>
            </div>

            <div v-else class="row g-4 achievements-cards">
              <div
                class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                v-for="(item, i) in achievementCards"
                :key="i"
              >
                <div class="achievement-card">
                  <div class="achievement-icon">
                    <i :class="`bi ${item.icon}`"></i>
                  </div>

                  <div class="achievement-content">
                    <h6 class="achievement-title">{{ item.title }}</h6>
                    <div class="achievement-value">{{ item.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              إغلاق
            </button>

            <button
              class="btn btn-primary px-4"
              :disabled="achievementLoading"
              @click="printReport"
            >
              <i class="bi bi-printer ms-1"></i>
              طباعة التقرير
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Area -->
    <div id="print-area" class="print-report">
  <div class="print-header">
    <h1> إحصائيات الإنجاز</h1>
    <p v-if="achievementFilter.year">لسنة {{ achievementFilter.year }}</p>
  </div>

  <div class="print-summary-cards">
    <div class="print-summary-card">
      <span>عدد الوارد</span>
      <strong>{{ achievements.incomingCount }}</strong>
    </div>

    <div class="print-summary-card">
      <span>إجمالي أنواع الوارد</span>
      <strong>{{ achievements.incomingTypeTotalCount }}</strong>
    </div>

    <div class="print-summary-card ">
      <span>إرسال الرازي</span>
      <strong>{{ achievements.finalStatusSendingAlRaziCount }}</strong>
    </div>
  </div>

  <div class="print-grid-two">
    <div class="print-section-box">
      <h3>الحالات النهائية</h3>
      <table class="print-table-modern">
        <tbody>
          <tr>
            <td>المصادقة</td>
            <td>{{ achievements.finalStatusAuthenticationCount }}</td>
          </tr>
          <tr>
            <td>الاسترجاع</td>
            <td>{{ achievements.finalStatusReturnCount }}</td>
          </tr>
          <tr>
            <td>مكتب المعاون</td>
            <td>{{ achievements.finalStatusDeputyOfficeCount }}</td>
          </tr>
          <tr>
            <td>إرسال الرازي</td>
            <td>{{ achievements.finalStatusSendingAlRaziCount }}</td>
          </tr>
          <tr>
            <td>صحة الإصدار</td>
            <td>{{ achievements.finalStatusHealthOfIssuanceCount }}</td>
          </tr>
          <tr>
            <td>الأولويات</td>
            <td>{{ achievements.finalStatusRequestPrioritiesCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="print-section-box">
      <h3>أنواع الوارد</h3>
      <table class="print-table-modern">
        <tbody>
          <tr>
            <td>جريح</td>
            <td>{{ achievements.incomingInjuredCount }}</td>
          </tr>
          <tr>
            <td>منتسب</td>
            <td>{{ achievements.incomingEmployCount }}</td>
          </tr>
          <tr>
            <td>مريض</td>
            <td>{{ achievements.incomingSickCount }}</td>
          </tr>
          <tr>
            <td>كتاب رسمي</td>
            <td>{{ achievements.incomingFormalBookCount }}</td>
          </tr>
          <tr class="section-total">
            <td>المجموع</td>
            <td>{{ achievements.incomingTypeTotalCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="print-section-box mt-print">
    <h3>تفاصيل إضافية</h3>
    <table class="print-table-modern">
      <tbody>
        <tr>
          <td>الاسترجاع</td>
          <td>{{ achievements.isReturnCount }}</td>
        </tr>
        <tr>
          <td>الاعتذارات</td>
          <td>{{ achievements.apologyCount }}</td>
        </tr>
        <tr>
          <td>المرضى</td>
          <td>{{ achievements.patientCount }}</td>
        </tr>
        <!-- <tr class="section-total final-total-row">
          <td>العدد الكلي</td>
          <td>{{ achievements.totalCount }}</td>
        </tr> -->
      </tbody>
    </table>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import Chart from "chart.js/auto";
import { Modal } from "bootstrap";
import VueSelect from "vue3-select";
import {
  getDashboardStats,
  trackIncoming,
  getAchievements,
} from "@/services/dashboard.service.js";
import { successAlert, errorAlert, warningAlert } from "@/utils/alert.js";

const loading = ref(true);
const activeSection = ref("incoming");
const dashboardFilter = ref({
  dateFrom: "",
  dateTo: "",
});

let landaChart = null;

const stats = ref({
  totalIncomingsCount: 0,
  generalIncomingsCount: 0,
  secretIncomingsCount: 0,

  injuredIncomingsCount: 0,
  employIncomingsCount: 0,
  sickIncomingsCount: 0,
  formalBookIncomingsCount: 0,

  marginNotesCount: {
    withMarginNotesCount: 0,
    withoutMarginNotesCount: 0,
    totalCount: 0,
  },

  landaCount: {
    achievedCount: 0,
    notAchievedCount: 0,
    totalCount: 0,
  },

  landaIsExportCount: {
    internalExportCount: 0,
    externalExportCount: 0,
  },

  injurySupportsCount: 0,

  auditingAndDataCount: {
    verifiedCount: 0,
    notVerifiedCount: 0,
    totalCount: 0,
  },

  finalStatusTypeCount: {
    defaultCount: 0,
    deputyOfficeCount: 0,
    sendingAlRaziCount: 0,
    healthOfIssuanceCount: 0,
    requestPrioritiesCount: 0,
    authenticationCount: 0,
    returnCount: 0,
    authorizedAuthenticationCount: 0,
  },
});

let mainStatsChart = null;
let incomingTypeChart = null;
let finalStatusChart = null;
let marginChart = null;

const destroyCharts = () => {
  if (mainStatsChart) {
    mainStatsChart.destroy();
    mainStatsChart = null;
  }
  if (incomingTypeChart) {
    incomingTypeChart.destroy();
    incomingTypeChart = null;
  }
  if (finalStatusChart) {
    finalStatusChart.destroy();
    finalStatusChart = null;
  }
  if (marginChart) {
    marginChart.destroy();
    marginChart = null;
  }
  if (landaChart) {
    landaChart.destroy();
    landaChart = null;
  }
};

const renderLandaChart = () => {
  const ctx = document.getElementById("landaChart");
  if (!ctx) return;

  if (landaChart) {
    landaChart.destroy();
  }

  landaChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["منجز", "غير منجز", "الصادر الداخلي", "الصادر الخارجي"],
      datasets: [
        {
          label: "شعبة الإدارة",
          data: [
            stats.value.landaCount.achievedCount,
            stats.value.landaCount.notAchievedCount,
            stats.value.landaIsExportCount.internalExportCount,
            stats.value.landaIsExportCount.externalExportCount,
          ],
          backgroundColor: [
            "rgba(18, 177, 209, 0.90)",
            "rgba(18, 177, 209, 0.70)",
            "rgba(18, 177, 209, 0.55)",
            "rgba(18, 177, 209, 0.40)",
          ],
          borderRadius: 12,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(18, 177, 209, 0.08)" },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
      },
    },
  });
};

const loadDashboardStats = async () => {
  if (
    dashboardFilter.value.dateFrom &&
    dashboardFilter.value.dateTo &&
    dashboardFilter.value.dateFrom > dashboardFilter.value.dateTo
  ) {
    return warningAlert(
      "تاريخ البداية يجب أن يكون أصغر من أو يساوي تاريخ النهاية"
    );
  }

  loading.value = true;
  destroyCharts();

  try {
    const params = {};

    if (dashboardFilter.value.dateFrom) {
      params.dateFrom = `${dashboardFilter.value.dateFrom}T00:00:00`;
    }

    if (dashboardFilter.value.dateTo) {
      params.dateTo = `${dashboardFilter.value.dateTo}T23:59:59`;
    }

    const res = await getDashboardStats(params);
    stats.value = res.data.data;
  } catch (err) {
    console.error("Dashboard error:", err);
    errorAlert("حدث خطأ أثناء تحميل الإحصائيات");
  } finally {
    loading.value = false;
    await nextTick();
    await renderChartsBySection();
  }
};

const getPercent = (value, total) => {
  const safeValue = Number(value) || 0;
  const safeTotal = Number(total) || 0;
  if (safeTotal <= 0) return 0;
  return Math.min(100, Math.round((safeValue / safeTotal) * 100));
};

const renderMainStatsChart = () => {
  const ctx = document.getElementById("mainStatsChart");
  if (!ctx) return;

  if (mainStatsChart) {
    mainStatsChart.destroy();
  }

  mainStatsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "الوارد الكلي",
        "العام",
        "السري",
        "الهامش",
        "الإدارة",
        "التدقيق",
        "الإرجاع",
      ],
      datasets: [
        {
          label: "الإحصائيات",
          data: [
            stats.value.totalIncomingsCount,
            stats.value.generalIncomingsCount,
            stats.value.secretIncomingsCount,
            stats.value.marginNotesCount.totalCount,
            stats.value.landaCount.totalCount,
            stats.value.auditingAndDataCount.totalCount,
            stats.value.finalStatusTypeCount.returnCount,
          ],
          borderColor: "#12b1d1",
          backgroundColor: "rgba(18, 177, 209, 0.12)",
          pointBackgroundColor: "#12b1d1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 3,
          pointRadius: 5,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(18, 177, 209, 0.08)" },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
      },
    },
  });
};

const renderIncomingTypeChart = () => {
  const ctx = document.getElementById("incomingTypeChart");
  if (!ctx) return;

  if (incomingTypeChart) {
    incomingTypeChart.destroy();
  }

  incomingTypeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["جريح", "منتسب", "مريض", "كتاب رسمي"],
      datasets: [
        {
          data: [
            stats.value.injuredIncomingsCount,
            stats.value.employIncomingsCount,
            stats.value.sickIncomingsCount,
            stats.value.formalBookIncomingsCount,
          ],
          backgroundColor: ["#12b1d1", "#7dd3fc", "#8b5cf6", "#c7f3fb"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false } },
    },
  });
};

const renderFinalStatusChart = () => {
  const ctx = document.getElementById("finalStatusChart");
  if (!ctx) return;

  if (finalStatusChart) {
    finalStatusChart.destroy();
  }

  finalStatusChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "الافتراضي",
        "مكتب المعاون",
        "إرسال الرازي",
        "صحة الإصدار",
        "الأولويات",
        "المصادقة",
        "المصادقة المخولة",
        "الإرجاع",
      ],
      datasets: [
        {
          label: "الحالات",
          data: [
            stats.value.finalStatusTypeCount.defaultCount,
            stats.value.finalStatusTypeCount.deputyOfficeCount,
            stats.value.finalStatusTypeCount.sendingAlRaziCount,
            stats.value.finalStatusTypeCount.healthOfIssuanceCount,
            stats.value.finalStatusTypeCount.requestPrioritiesCount,
            stats.value.finalStatusTypeCount.authenticationCount,
            stats.value.finalStatusTypeCount.authorizedAuthenticationCount,
            stats.value.finalStatusTypeCount.returnCount,
          ],
          backgroundColor: [
            "rgba(18, 177, 209, 0.95)",
            "rgba(18, 177, 209, 0.88)",
            "rgba(18, 177, 209, 0.80)",
            "rgba(18, 177, 209, 0.72)",
            "rgba(18, 177, 209, 0.64)",
            "rgba(18, 177, 209, 0.56)",
            "rgba(18, 177, 209, 0.48)",
            "rgba(18, 177, 209, 0.40)",
          ],
          borderRadius: 12,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(18, 177, 209, 0.08)" },
          ticks: {
            color: "#7b8a97",
            font: { family: "Cairo", size: 12 },
          },
        },
      },
    },
  });
};

const renderChartsBySection = async () => {
  if (loading.value) return;

  await nextTick();

  if (activeSection.value === "incoming") {
    renderIncomingTypeChart();
  }

  if (activeSection.value === "finalAudit") {
    renderFinalStatusChart();
  }

  if (activeSection.value === "margin") {
    renderMarginChart();
  }

  if (activeSection.value === "landa") {
    renderLandaChart();
  }

  if (activeSection.value === "generalStats") {
    renderMainStatsChart();
  }
};

watch(activeSection, async () => {
  await renderChartsBySection();
});

const renderMarginChart = () => {
  const ctx = document.getElementById("marginChart");
  if (!ctx) return;

  if (marginChart) {
    marginChart.destroy();
  }

  marginChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["منجز", "غير منجز"],
      datasets: [
        {
          data: [
            stats.value.marginNotesCount.withMarginNotesCount,
            stats.value.marginNotesCount.withoutMarginNotesCount,
          ],
          backgroundColor: ["#12b1d1", "#8b5cf6"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: { display: false },
      },
    },
  });
};

const trackModalEl = ref(null);
let trackModal = null;

const typeOptions = [
  { label: "جريح", value: 1 },
  { label: "منتسب", value: 2 },
  { label: "مريض", value: 3 },
  { label: "كتاب رسمي", value: 4 },
];

const trackForm = ref({
  injuredName: "",
  incomingBookNumber: "",
  typeName: null,
});

const trackResult = ref({
  incomingBookNumber: "",
  incomingDate: null,
  subject: "",
  source: "",
  createdByUserName: "",
  content: "",
  formationName: "",
  injuredNames: [],
  transfers: [],
  actions: [],
});

const track = async () => {
  if (!trackForm.value.injuredName && !trackForm.value.incomingBookNumber) {
    return warningAlert("يرجى إدخال اسم الجريح أو رقم الكتاب");
  }

  try {
    const res = await trackIncoming(trackForm.value);
    const data = res.data.data;

    trackResult.value = {
      incomingBookNumber: data.incomingBookNumber || "",
      incomingDate: data.incomingDate || null,
      subject: data.subject || "",
      source: data.source || "",
      createdByUserName: data.createdByUserName || "",
      content: data.content || "",
      formationName: data.formationName || "",
      injuredNames: Array.isArray(data.injuredNames) ? data.injuredNames : [],
      transfers: Array.isArray(data.transfers) ? data.transfers : [],
      actions: Array.isArray(data.actions) ? data.actions : [],
    };

    successAlert("تم العثور على معلومات الوارد");
    requestAnimationFrame(() => trackModal?.show());
  } catch (e) {
    console.error(e);
    errorAlert("لم يتم العثور على معلومات مطابقة");
  }
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const closeTrackModal = () => {
  if (!trackModal) return;
  trackModal.hide();
};

const achievementFilter = ref({
  year: null,
  month: null,
  day: null,
});

const achievementLoading = ref(false);
const achievements = ref({
  incomingCount: 0,
  isReturnCount: 0,
  governmentCount: 0,
  civilianCount: 0,
  apologyCount: 0,
  finalStatusDeputyOfficeCount: 0,
  finalStatusSendingAlRaziCount: 0,
  finalStatusHealthOfIssuanceCount: 0,
  finalStatusRequestPrioritiesCount: 0,
  finalStatusAuthenticationCount: 0,
  finalStatusReturnCount: 0,
  incomingTypeTotalCount: 0,
  patientCount: 0,
  incomingInjuredCount: 0,
  incomingEmployCount: 0,
  incomingSickCount: 0,
  incomingFormalBookCount: 0,
  assistantOfficeCount: 0,
  totalCount: 0,
});

const loadAchievements = async () => {
  achievementLoading.value = true;
  try {
    const res = await getAchievements(achievementFilter.value);
    achievements.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    achievementLoading.value = false;
  }
};

watch(
  () => ({ ...achievementFilter.value }),
  () => {
    loadAchievements();
  }
);

const achievementCards = computed(() => [
  {
    title: "عدد الوارد",
    value: achievements.value.incomingCount,
    icon: "bi-inbox",
  },
  {
    title: "الاسترجاع",
    value: achievements.value.isReturnCount,
    icon: "bi-arrow-counterclockwise",
  },
  {
    title: "الاعتذارات",
    value: achievements.value.apologyCount,
    icon: "bi-x-circle",
  },
  {
    title: "مصادقة",
    value: achievements.value.finalStatusAuthenticationCount,
    icon: "bi-patch-check",
  },
  {
    title: "الإرجاع النهائي",
    value: achievements.value.finalStatusReturnCount,
    icon: "bi-arrow-return-left",
  },
  {
    title: "جريح",
    value: achievements.value.incomingInjuredCount,
    icon: "bi-person-heart",
  },
  {
    title: "منتسب",
    value: achievements.value.incomingEmployCount,
    icon: "bi-person-badge",
  },
  {
    title: "مريض",
    value: achievements.value.incomingSickCount,
    icon: "bi-heart-pulse",
  },
  {
    title: "كتاب رسمي",
    value: achievements.value.incomingFormalBookCount,
    icon: "bi-file-earmark-text",
  },
  // {
  //   title: "العدد الكلي",
  //   value: achievements.value.totalCount,
  //   icon: "bi-bar-chart-line",
  // },
]);

const printReport = () => {
  const printContent = document.getElementById("print-area")?.innerHTML || "";
  const win = window.open("", "", "width=1000,height=800");
  if (!win) return;

  win.document.write(`
    <html lang="ar">
      <head>
        <title>تقرير إحصائيات الإنجاز</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
            padding: 24px;
            color: #000;
            background: #fff;
          }

          .print-header {
            text-align: center;
            margin-bottom: 24px;
          }

          .print-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }

          .print-header p {
            margin: 8px 0 0;
            font-size: 18px;
          }

          .print-summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }

          .print-summary-card {
            border: 1px solid #000;
            padding: 14px;
            text-align: center;
            border-radius: 8px;
            background: #f8fbfc;
          }

          .print-summary-card span {
            display: block;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .print-summary-card strong {
            display: block;
            font-size: 28px;
            font-weight: 700;
          }

          .print-summary-card.highlight {
            background: #eaf7fb;
          }

          .print-grid-two {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }

          .print-section-box {
            border: 1px solid #000;
            border-radius: 8px;
            padding: 14px;
            background: #fff;
          }

          .print-section-box h3 {
            margin: 0 0 14px;
            font-size: 20px;
            font-weight: 700;
            border-bottom: 1px solid #000;
            padding-bottom: 8px;
          }

          .print-table-modern {
            width: 100%;
            border-collapse: collapse;
          }

          .print-table-modern td {
            border: 1px solid #000;
            padding: 10px 12px;
            font-size: 15px;
          }

          .print-table-modern td:first-child {
            font-weight: 600;
            width: 70%;
          }

          .print-table-modern td:last-child {
            text-align: center;
            font-weight: 700;
            width: 30%;
          }

          .section-total td {
            font-weight: 700;
            background: #f1f6f8;
          }

          .final-total-row td {
            background: #e6f7fb;
            font-size: 16px;
          }

          .mt-print {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);

  win.document.close();
  win.print();
};
watch(activeSection, async () => {
  if (loading.value) return;
  await nextTick();
  await renderChartsBySection();
});

const resetDashboardFilter = async () => {
  dashboardFilter.value.dateFrom = "";
  dashboardFilter.value.dateTo = "";
  await loadDashboardStats();
};
onMounted(async () => {
  trackModal = new Modal(trackModalEl.value);
  await loadDashboardStats();
});
</script>

<style scoped>
.dashboard {
  --primary: #12b1d1;
  --primary-light: #e9fbff;
  --primary-soft: rgba(18, 177, 209, 0.08);
  --text-main: #1f2937;
  --text-muted: #2a2c2d;
  --white: #ffffff;
  --border-soft: rgba(18, 177, 209, 0.12);
  --shadow-soft: 0 20px 45px rgba(17, 24, 39, 0.06);
  --shadow-card: 0 10px 25px rgba(18, 177, 209, 0.08);
  --radius-xl: 28px;
  --radius-lg: 22px;
  --radius-md: 18px;
  --radius-sm: 14px;

  min-height: 100vh;
  padding-bottom: 30px;
}

.btn-search {
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #12b1d1, #12b1d1);
  color: #fff;
  font-weight: 700;
  padding: 0.9rem 1.2rem;
  transition: all 0.25s ease;
  box-shadow: 0 12px 24px rgba(18, 177, 209, 0.24);
}

.btn-search:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 12px 24px rgba(18, 177, 209, 0.22),
    0 6px 12px rgba(18, 177, 209, 0.12);
  background: linear-gradient(135deg, #18a7c3, #128faa);
  filter: brightness(1.03);
}

.track-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(18, 177, 209, 0.1);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
}

.track-title {
  color: var(--text-main);
}

.track-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.1rem;
}

.track-card .form-control,
.track-card .vs__dropdown-toggle {
  min-height: 52px;
  border-radius: 16px !important;
  border: 1px solid rgba(18, 177, 209, 0.16) !important;
  background: #fff !important;
  box-shadow: none !important;
  transition: all 0.22s ease;
}

.track-card .form-control:focus,
.track-card .vs__dropdown-toggle:focus-within {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(18, 177, 209, 0.1) !important;
}

.track-card .form-label {
  color: var(--text-main);
  margin-bottom: 0.55rem;
}

.track-btn {
  min-height: 52px;
  border-radius: 16px;
}



@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modern-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(18, 177, 209, 0.12);
  border-radius: 24px;
  box-shadow: 0 12px 28px rgba(18, 177, 209, 0.08);
  backdrop-filter: blur(10px);
}

.dashboard-tabs button {
  position: relative;
  border: none;
  background: linear-gradient(180deg, #f8fdff 0%, #eefaff 100%);
  color: #4f6b74;
  padding: 12px 20px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 0.96rem;
  border: 1px solid rgba(18, 177, 209, 0.1);
  transition:
    transform 0.28s ease,
    background 0.28s ease,
    color 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
  overflow: hidden;
}

.dashboard-tabs button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.45) 40%,
    transparent 80%
  );
  transform: translateX(-140%);
  transition: transform 0.55s ease;
}

.dashboard-tabs button:hover {
  transform: translateY(-3px) scale(1.02);
  background: linear-gradient(180deg, #f3fcff 0%, #e8f9ff 100%);
  color: #12b1d1;
  border-color: rgba(18, 177, 209, 0.2);
  box-shadow: 0 10px 20px rgba(18, 177, 209, 0.12);
}

.dashboard-tabs button:hover::before {
  transform: translateX(140%);
}

.dashboard-tabs button.active {
  background: linear-gradient(135deg, #12b1d1, #27c0df);
  color: #fff;
  border-color: transparent;
  transform: translateY(-4px);
  box-shadow:
    0 14px 24px rgba(18, 177, 209, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dashboard-tabs button.active::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 8px;
  height: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
}

.dashboard-tabs button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .dashboard-tabs {
    padding: 10px;
    gap: 10px;
    justify-content: stretch;
  }

  .dashboard-tabs button {
    width: 100%;
    text-align: center;
    padding: 12px 16px;
  }

  .dashboard-tabs button.active {
    transform: none;
  }
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 2px;
}

.section-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.section-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.soft-card {
  background: rgba(255, 255, 255, 0.534);
  border: 1px solid rgba(44, 63, 71, 0.289);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.soft-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 35px rgba(18, 177, 209, 0.12);
}

.summary-grid {
  display: grid;
  gap: 16px;
}

.three-cols {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-card {
  padding: 16px 18px;
  min-height: 104px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.primary-card {
  background: linear-gradient(135deg, #12b1d1 0%, #12b1d1 100%);
  color: #fff;
  border: none;
  box-shadow: 0 16px 30px rgba(18, 177, 209, 0.28);
}

.primary-card .summary-label,
.primary-card small,
.primary-card h3,
.primary-card .summary-icon {
  color: #fff;
}

.incoming-total-content,
.incoming-total-label,
.incoming-total-number,
.incoming-total-note {
  color: #fff !important;
}

.summary-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.2rem;
}

.primary-card .summary-icon {
  background: rgba(255, 255, 255, 0.18);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 1.1rem;
  color: var(--text-muted);
  font-weight: 700;
}

.summary-card h3 {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-main);
}

.summary-card small {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.incoming-types-card {
  padding: 20px;
  border-radius: 24px;
}

.incoming-types-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(18, 177, 209, 0.1);
}

.incoming-types-card-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.incoming-types-main-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #12b1d1, #12b1d1);
  color: #fff;
  font-size: 1.15rem;
  box-shadow: 0 10px 20px rgba(18, 177, 209, 0.2);
}

.incoming-types-card-title h5 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 800;
  color: var(--text-main);
}

.incoming-types-card-title p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.incoming-types-total {
  min-width: 110px;
  text-align: center;
  background: #f8fcfe;
  border: 1px solid rgba(134, 162, 167, 0.1);
  border-radius: 16px;
  padding: 10px 14px;
}

.incoming-types-total small {
  display: block;
  color: var(--text-muted);
  font-size: 0.74rem;
  margin-bottom: 4px;
}

.incoming-types-total strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}

.incoming-types-card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.incoming-types-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(18, 177, 209, 0.08);
}

.incoming-item-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(18, 177, 209, 0.1);
  color: var(--primary);
  font-size: 1rem;
  flex-shrink: 0;
}

.incoming-item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.incoming-item-content small {
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 700;
}

.incoming-item-content strong {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 800;
}

.incoming-types-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
}

.incoming-types-card-item {
  width: 100%;
  min-height: 96px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(180deg, #fbfeff 0%, #f5fcff 100%);
  border: 1px solid rgba(63, 130, 143, 0.636);
  border-radius: 18px;
  padding: 16px;
  transition: all 0.25s ease;
}

.incoming-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.incoming-item-content small {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.incoming-item-content strong {
  color: var(--text-main);
  font-size: 1.35rem;
  font-weight: 800;
}

.final-status-card {
  position: relative;
  padding: 22px;
  border-radius: 28px;
  overflow: hidden;
  /* background:
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(255, 255, 255, 0.96) 38%,
      rgba(255, 255, 255, 0.88) 100%
    ),
    linear-gradient(135deg, #12b1d1 0%, #67dff4 45%, #12b1d1 100%); */
  border: 1px solid rgba(18, 177, 209, 0.22);
  box-shadow: 0 22px 45px rgba(18, 177, 209, 0.16),
    0 10px 24px rgba(17, 24, 39, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  isolation: isolate;
}

.final-status-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    90deg,
    rgba(18, 177, 209, 0.14) 1px,
    transparent 1px
  );
  background-size: 46px 100%;
  pointer-events: none;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.18) 72%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.18) 72%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 0;
}

.final-status-card::after {
  content: "";
  position: absolute;
  width: 240px;
  height: 240px;
  top: -90px;
  left: -60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(18, 177, 209, 0.2) 0%,
    rgba(18, 177, 209, 0.08) 45%,
    rgba(18, 177, 209, 0) 75%
  );
  pointer-events: none;
  z-index: 0;
}

.final-status-card > * {
  position: relative;
  z-index: 1;
}

.final-status-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(18, 177, 209, 0.14);
}

.final-status-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.final-status-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #12b1d1, #12b1d1);
  color: #fff;
  font-size: 1.25rem;
  box-shadow: 0 12px 26px rgba(18, 177, 209, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.final-status-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 900;
  color: #12313a;
}

.final-status-subtitle {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: #58717a;
}

.final-status-total {
  text-align: center;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(18, 177, 209, 0.14);
  border-radius: 18px;
  padding: 12px 16px;
  min-width: 118px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 8px 18px rgba(18, 177, 209, 0.08);
  backdrop-filter: blur(8px);
}

.final-status-total small {
  display: block;
  color: #6f8790;
  font-size: 0.76rem;
  margin-bottom: 4px;
}

.final-status-total strong {
  font-size: 1.35rem;
  color: var(--primary);
  font-weight: 900;
}

.final-status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.final-status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ebf5f8;
  border: 1px solid rgba(76, 86, 88, 0.551);
  border-radius: 18px;
  padding: 14px;
  transition: all 0.25s ease;
  backdrop-filter: blur(6px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 10px 18px rgba(18, 177, 209, 0.05);
}

.final-status-item:hover {
  transform: translateY(-2px) scale(1.01);
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 14px 24px rgba(18, 177, 209, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.final-status-item .item-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(18, 177, 209, 0.16),
    rgba(18, 177, 209, 0.08)
  );
  color: var(--primary);
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.final-status-item .item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 800;
}

.final-status-item .item-content small {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.final-status-item .item-content strong {
  color: var(--text-main);
  font-size: 1.5rem;
  font-weight: 800;
}

.analytics-card,
.progress-card {
  padding: 18px;
}

.large-chart-card {
  min-height: auto;
}

.chart-wrap {
  position: relative;
  width: 100%;
}

.chart-line-wrap {
  height: 240px;
}

.small-chart-wrap {
  height: 220px;
}

.chart-bar-wrap {
  height: 250px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.section-head h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-main);
}

.section-head p {
  margin: 3px 0 0;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.section-badge {
  background: var(--primary-light);
  color: var(--primary);
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
}

.progress-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
  font-weight: 700;
}

.progress-info div {
  background: #ebf5f8;
  border: 1px solid rgba(76, 86, 88, 0.551);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-info span {
  color: var(--text-muted);
  font-size: 0.98rem;
}

.progress-info strong {
  color: var(--text-main);
  font-size: 1.4rem;
  font-weight: 700;
}

.modern-progress {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: #eef7fa;
  overflow: hidden;
  position: relative;
}

.modern-progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #12b1d1, #67dff4);
  box-shadow: 0 6px 14px rgba(18, 177, 209, 0.22);
  transition: width 0.45s ease;
}

.custom-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
  color: var(--text-main);
  font-size: 0.92rem;
  font-weight: 700;
}

.custom-legend div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-1 {
  background: #12b1d1;
}
.dot-2 {
  background: #7dd3fc;
}
.dot-3 {
  background: #8b5cf6;
}
.dot-4 {
  background: #c7f3fb;
}

.achievements-cards .achievement-card {
  height: 100%;
  padding: 20px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgb(17, 78, 113);
  box-shadow: 0 12px 24px rgba(18, 177, 209, 0.08);
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.25s ease;
}

.achievements-cards .achievement-card:hover {
  transform: translateY(-3px);
}

.achievement-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.achievement-title {
  margin: 0 0 6px;
  color: var(--text-muted);
  font-weight: 700;
}

.achievement-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
}

.info-card {
  background: #fff;
  border: 1px solid rgba(18, 177, 209, 0.1);
  border-radius: 22px;
  box-shadow: 0 10px 22px rgba(18, 177, 209, 0.06);
  padding: 20px;
  margin-bottom: 18px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.info-header i {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.info-header h6 {
  margin: 0;
  font-weight: 800;
  color: var(--text-main);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-item {
  background: #f9fdff;
  border: 1px solid rgba(36, 44, 45, 0.655);
  border-radius: 16px;
  padding: 14px;
}

.info-item span {
  display: block;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.info-item strong {
  color: var(--text-main);
}

.injured-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.injured-badge {
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.timeline-modern {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.timeline-modern li {
  position: relative;
  padding-inline-start: 34px;
  margin-bottom: 18px;
}

.timeline-dot {
  position: absolute;
  right: 0;
  top: 10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 6px rgba(18, 177, 209, 0.12);
}

.timeline-card {
  background: #fbfeff;
  border: 1px solid rgba(18, 177, 209, 0.1);
  border-radius: 18px;
  padding: 15px;
}

.timeline-card strong {
  color: var(--text-main);
}

.timeline-meta,
.timeline-dates,
.timeline-note,
.timeline-status {
  color: var(--text-muted);
  margin-top: 8px;
  line-height: 1.7;
}

@media (max-width: 1200px) {
  .three-cols {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .incoming-types-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .final-status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 992px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .progress-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding-inline: 8px;
  }

  .dashboard-tabs {
    padding: 8px;
  }

  .dashboard-tabs button {
    width: 100%;
  }

  .three-cols,
  .incoming-types-card-grid,
  .final-status-grid {
    grid-template-columns: 1fr;
  }

  .incoming-types-card-header,
  .final-status-header {
    flex-direction: column;
    align-items: stretch;
  }

  .custom-legend {
    grid-template-columns: 1fr;
  }

  .chart-line-wrap,
  .chart-bar-wrap,
  .small-chart-wrap {
    height: 240px;
  }

  .appbar {
    flex-direction: column;
    align-items: stretch !important;
    gap: 14px;
  }

  .btn-wrapper {
    width: 100%;
  }
}

.dashboard-filter-card {
  padding: 20px;
  border-radius: 26px;
  background-color: #f0f5f6;
  border: 1px solid rgb(17, 78, 113);
  box-shadow: 0 16px 32px rgba(18, 177, 209, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.dashboard-filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(18, 177, 209, 0.1);
}

.dashboard-filter-head h5 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.dashboard-filter-head p {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.filter-head-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #12b1d1, #67dff4);
  color: #fff;
  font-size: 1.15rem;
  box-shadow: 0 12px 24px rgba(18, 177, 209, 0.22);
  flex-shrink: 0;
}

.filter-input-wrap {
  position: relative;
}

.filter-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(18, 177, 209, 0.08);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: 0.95rem;
}

.filter-control {
  min-height: 54px;
  border-radius: 16px !important;
  border: 1px solid rgba(18, 177, 209, 0.16) !important;
  background: #fff !important;
  box-shadow: none !important;
  padding-right: 56px !important;
  color: var(--text-main);
  font-weight: 600;
  transition: all 0.22s ease;
}

.filter-control:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px rgba(18, 177, 209, 0.1) !important;
}

.filter-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.filter-btn {
  min-height: 54px;
  border-radius: 16px;
}

.btn-reset-filter {
  min-height: 54px;
  border: none;
  border-radius: 16px;
  background: #ffffffad;
  color: #47616a;
  font-weight: 800;
  padding: 0.9rem 1.1rem;
  border: 1px solid rgba(18, 177, 209, 0.12);
  transition: all 0.25s ease;
}

.btn-reset-filter:hover {
  background: #ecf7fa;
  color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(18, 177, 209, 0.12);
}

@media (max-width: 992px) {
  .filter-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .dashboard-filter-card {
    padding: 16px;
    border-radius: 22px;
  }

  .dashboard-filter-head {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-head-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }
}

.dashboard-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 6px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(18, 177, 209, 0.1);
  border-radius: 24px;
  box-shadow: 0 10px 24px rgba(18, 177, 209, 0.06);
  backdrop-filter: blur(10px);
}

.dashboard-tabs button {
  position: relative;
  border: none;
  background: rgba(244, 252, 255, 0.9);
  color: #4f6b74;
  padding: 12px 18px;
  border-radius: 16px;
  transition: all 0.28s ease;
  border: 1px solid rgba(18, 177, 209, 0.08);
  overflow: hidden;
}

.dashboard-tabs button:hover {
  transform: translateY(-2px);
  background: #ecfbff;
  color: #12b1d1;
  box-shadow: 0 8px 18px rgba(18, 177, 209, 0.08);
}

.dashboard-tabs button.active {
  background: #12b1d1;
  color: #ffffff;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 24px rgba(18, 177, 209, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(18, 177, 209, 0.2);
}

.dashboard-tabs button.active::after {
  transform: scaleX(1);
}

.dashboard-tabs button:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .dashboard-tabs {
    padding: 8px;
    gap: 10px;
  }

  .dashboard-tabs button {
    width: 100%;
    text-align: center;
  }

  .dashboard-tabs button.active {
    transform: none;
  }
}

.section-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.section-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.section-fade-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* انميشن الكاردات نفسها */
.reveal-card {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
  animation: cardReveal 0.55s ease forwards;
}

/* stagger */
.dashboard-section .reveal-card:nth-child(1) {
  animation-delay: 0.04s;
}
.dashboard-section .reveal-card:nth-child(2) {
  animation-delay: 0.1s;
}
.dashboard-section .reveal-card:nth-child(3) {
  animation-delay: 0.16s;
}
.dashboard-section .reveal-card:nth-child(4) {
  animation-delay: 0.22s;
}
.dashboard-section .reveal-card:nth-child(5) {
  animation-delay: 0.28s;
}
.dashboard-section .reveal-card:nth-child(6) {
  animation-delay: 0.34s;
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.slide-up-card {
  opacity: 0;
  transform: translateY(35px);
  animation: slideUpFade 0.7s ease forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(35px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* print-area */
.print-report {
  display: none;
  direction: rtl;
  text-align: right;
  font-family: Arial, sans-serif;
  color: #000;
  background: #fff;
  padding: 24px;
}

.print-header {
  text-align: center;
  margin-bottom: 24px;
}

.print-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.print-header p {
  margin: 8px 0 0;
  font-size: 18px;
}

.print-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.print-summary-card {
  border: 1px solid #000;
  padding: 14px;
  text-align: center;
  border-radius: 8px;
  background: #f8fbfc;
}

.print-summary-card span {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
}

.print-summary-card strong {
  display: block;
  font-size: 28px;
  font-weight: 700;
}

.print-summary-card.highlight {
  background: #eaf7fb;
}

.print-grid-two {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.print-section-box {
  border: 1px solid #000;
  border-radius: 8px;
  padding: 14px;
  background: #fff;
}

.print-section-box h3 {
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 700;
  border-bottom: 1px solid #000;
  padding-bottom: 8px;
}

.print-table-modern {
  width: 100%;
  border-collapse: collapse;
}

.print-table-modern td {
  border: 1px solid #000;
  padding: 10px 12px;
  font-size: 15px;
}

.print-table-modern td:first-child {
  font-weight: 600;
  width: 70%;
}

.print-table-modern td:last-child {
  text-align: center;
  font-weight: 700;
  width: 30%;
}

.section-total td {
  font-weight: 700;
  background: #f1f6f8;
}

.final-total-row td {
  background: #e6f7fb;
  font-size: 16px;
}

.mt-print {
  margin-top: 20px;
}
</style>
