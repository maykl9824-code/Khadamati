import { supabase } from './supabase.js';

function bookService(service) {
  const name = prompt("اكتب اسمك:");
  if (!name) return;

  const phone = prompt("اكتب رقم هاتفك:");
  if (!phone) return;

  const address = prompt("اكتب عنوانك:");
  if (!address) return;

  saveRequest(name, phone, address, service);
}

async function saveRequest(name, phone, address, service) {
  const { error } = await supabase
    .from('service_requests')
    .insert({
      customer_name: name,
      phone: phone,
      address: address,
      service_type: service
    });

  if (error) {
    alert("لم يتم حفظ الطلب: " + error.message);
    return;
  }

  alert("تم حفظ طلبك بنجاح!");
}

window.bookService = bookService;
