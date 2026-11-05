const SUPABASE_URL = 'https://vrhyyogfzenzgdiiduhx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rqAcMpzMNV_Tcsw4mzrO3A_aCpCMgmo';

let selectedService = '';

function bookService(service) {
  selectedService = service;
  document.getElementById('selectedService').textContent =
    'الخدمة المختارة: ' + service;

  document.getElementById('booking').style.display = 'block';
  document.getElementById('booking').scrollIntoView({
    behavior: 'smooth'
  });
}

function closeBooking() {
  document.getElementById('booking').style.display = 'none';
}

document.getElementById('bookingForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'جاري إرسال الطلب...';

  try {
    const response = await fetch(
      SUPABASE_URL + '/rest/v1/service_requests',
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          customer_name: name,
          phone: phone,
          address: address,
          service_type: selectedService
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert('تم حفظ طلبك بنجاح!');
    this.reset();
    closeBooking();

  } catch (error) {
    alert('فشل حفظ الطلب: ' + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'تأكيد الحجز';
  }
});
