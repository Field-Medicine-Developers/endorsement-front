<template>
  <div class="p-5 mb-4 box rounded-3">
      <div class="container-fluid py-5">
          <h1 class="display-5 fw-bold">واجهة برمجة اختيار جهات الاتصال</h1>
          <p class="col-md-8 fs-4">لطالما كان الوصول إلى جهات الاتصال ميزة متاحة داخل التطبيقات الأصلية. تجلب Contacts Picker API هذه الإمكانية لتطبيقات الويب.</p>
          <p class="col-md-8 fs-4">تشمل حالات الاستخدام اختيار جهات اتصال لإرسال رسالة عبر تطبيق بريد إلكتروني أو دردشة، واختيار رقم هاتف جهة اتصال للاستخدام مع بروتوكول VOIP، أو اكتشاف جهات الاتصال التي انضمت بالفعل إلى منصة اجتماعية. يمكن لعوامل المستخدم أيضًا تقديم تجربة متسقة مع التطبيقات الأخرى على جهاز المستخدم.</p>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

interface Contact {
  name: string;
  email: string;
  phone?: string;
}

const newContact = reactive({
  name: '',
  email: '',
  phone: ''
});

const contacts = ref<Contact[]>([]);

function addContact() {
  if (newContact.name && newContact.email) {
    contacts.value.push({
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || undefined
    });
    
    // Reset form
    newContact.name = '';
    newContact.email = '';
    newContact.phone = '';
  }
}

function removeContact(index: number) {
  contacts.value.splice(index, 1);
}
</script>

<style scoped>
.box {
  background-color: #f8f9fa;
}

.text-purple {
  color: #6f42c1;
}
</style>