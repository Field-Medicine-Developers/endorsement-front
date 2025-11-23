<template>
  <div class="row align-items-md-stretch">
    <!-- الكارد الأول: المودال -->
    <div class="col-md-6 mb-4">
      <div class="h-100 p-5 text-white bg-dark border rounded-3">
        <h2>{{ msg }}</h2>
        <p>قبل البدء باستخدام مكون الـ Modal في Bootstrap، تأكد من قراءة ما يلي لأن خيارات القائمة قد تغيرت مؤخراً.</p>
        <ul>
          <li>
            الـ Modals مبنية باستخدام HTML و CSS و JavaScript. يتم وضعها فوق باقي عناصر الصفحة وتوقف التمرير من
            <code class="highlighter-rouge">&lt;body&gt;</code>
            حتى يتم تمرير محتوى المودال فقط.
          </li>
          <li>النقر على الخلفية (backdrop) سيغلق المودال تلقائياً.</li>
          <li>يدعم Bootstrap نافذة مودال واحدة فقط في كل مرة. المودالات المتداخلة غير مدعومة لأنها تعتبر تجربة مستخدم سيئة.</li>
          <li>
            الـ Modals تستخدم
            <code class="highlighter-rouge">position: fixed</code>
            ، وهذا أحياناً يسبب مشاكل في العرض. يفضل وضع كود المودال في مستوى علوي بالصفحة لتجنب التداخل مع عناصر أخرى.
          </li>
          <li>
            بسبب استخدام
            <code class="highlighter-rouge">position: fixed</code>
            هناك بعض الملاحظات عند استخدام المودال على الهواتف المحمولة.
            <a href="https://getbootstrap.com/docs/4.0/getting-started/browsers-devices/#modals-and-dropdowns-on-mobile" target="_blank" rel="noopener noreferrer">راجع التوثيق الخاص بالدعم</a>
            للمزيد من التفاصيل.
          </li>
          <li>
            حسب تعريف HTML5، الخاصية
            <code class="highlighter-rouge">autofocus</code>
            لا تعمل داخل المودالات. للحصول على نفس النتيجة يجب استخدام JavaScript مخصص.
          </li>
        </ul>

        <button type="button" class="btn btn-outline-light" @click="modal.show()">فتح المودال</button>
        <div class="modal fade" ref="infoModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 id="infoModalLabel">كم مرة ضغطت الزر؟</h5>
                <button type="button" class="btn-close" @click="modal.hide()" aria-label="إغلاق"></button>
              </div>
              <div class="modal-body">
                <button @click="state.count++" class="btn btn-primary text-uppercase">
                  ضغطتني {{ state.count }} مرة{{ state.count === 1 ? "" : "ات" }}
                </button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="modal.hide()">إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

    <!-- الكارد الثاني: التوست + الشبكة -->
    <div class="col-md-6 mb-4">
      <div class="p-5 box border rounded-3 mb-4">
        <h2>إشعارات Toast</h2>
        <p>التوست عبارة عن إشعارات خفيفة الوزن مصممة لتقليد إشعارات الدفع الشائعة في أنظمة الهواتف والحواسيب. وهي مبنية باستخدام flexbox لسهولة المحاذاة.</p>

        <button type="button" class="btn btn-outline-secondary" @click="toast.show()">إظهار التوست</button>
        <div class="position-fixed bottom-0 end-0 p-3 emerge-11">
          <div ref="bsToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-info text-dark">
              <i class="bi bi-hand-index me-1"></i>
              <strong class="me-auto">أي إصبع؟</strong>
              <small>منذ قليل</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="إغلاق"></button>
            </div>
            <div class="toast-body box">مرحباً! هذه رسالة إشعار (Toast).</div>
          </div>
        </div>
      </div> 

    <div class="p-5 box border rounded-3">
        <h2>شبكة Bootstrap</h2>
        <p>
          نظام الشبكة في Bootstrap يستخدم سلسلة من الحاويات (containers) والصفوف (rows) والأعمدة (columns) لترتيب المحتوى. 
          وهو مبني على
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox" target="_blank" rel="noopener noreferrer">flexbox</a>
          وهو متجاوب بالكامل. أدناه مثال مع شرح لكيفية عمل الشبكة.
        </p>
        <div class="bd-example bd-example-row">
          <div class="row">
            <div class="col-12 col-lg-8 bg-secondary" style="--bs-bg-opacity:0.15">.col-12 .col-lg-8</div>
            <div class="col-12 col-lg-4 bg-secondary bg-opacity-50">.col-12 .col-lg-4</div>
          </div>

          <div class="row">
            <div class="col-6 col-md-4 bg-secondary bg-opacity-25">.col-6 .col-md-4</div>
            <div class="col-6 col-md-4 bg-secondary bg-opacity-10">.col-6 .col-md-4</div>
            <div class="col-12 col-md-4 bg-secondary bg-opacity-75">.col-12 .col-md-4</div>
          </div>

          <div class="row">
            <div class="col-6 bg-secondary bg-gradient bg-opacity-50">.col-6</div>
            <div class="col-6 bg-secondary bg-gradient bg-opacity-75">.col-6</div>
          </div>
        </div>
      </div> 

      <!-- أيقونات -->
      <div class="p-5 box border rounded-3 mt-4 d-flex justify-content-between">
        <i class="bi bi-house-fill"></i>
        <i class="bi bi-boxes"></i>
        <i class="bi bi-car-front-fill"></i>
        <i class="bi bi-cart4"></i>
        <i class="bi bi-cloud-snow"></i>
        <i class="bi bi-gear"></i>
      </div> 
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, onUnmounted } from "vue";
import { Modal, Toast } from "bootstrap";

defineProps({
  msg: String
});

const state     = reactive({ count: 0 });
const modal     = ref();
const toast     = ref();
const infoModal = ref();
const bsToast   = ref();

onMounted(() => {
  modal.value = new Modal(infoModal.value);
  toast.value = new Toast(bsToast.value);
});

onUnmounted(() => {
  modal.value = "";
  toast.value = "";
});
</script>

<style lang="scss" scoped>
#infoModalLabel { color: var(--bs-body-color); }
</style>
