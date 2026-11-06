
const SUPABASE_URL = 'https://vrhyyogfzenzgdiiduhx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rqAcMpzMNV_Tcsw4mzrO3A_aCpCMgmo';

let selectedService = '';

// ============================
// حجز خدمات العملاء
// ============================

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

const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    const button = this.querySelector('button[type="submit"]');

    button.disabled = true;
    button.textContent = 'جاري إرسال الطلب...';

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
            service_type: selectedService,
status: 'searching'
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
      button.disabled = false;
      button.textContent = 'تأكيد الحجز';
    }
  });
}

// ============================
// تسجيل الفنيين
// ============================

const technicianForm = document.getElementById('technicianForm');

if (technicianForm) {
  technicianForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('techName').value.trim();
    const phone = document.getElementById('techPhone').value.trim();
    const service = document.getElementById('techService').value;

    const button = this.querySelector('button[type="submit"]');

    button.disabled = true;
    button.textContent = 'جاري التسجيل...';

    try {
      const response = await fetch(
        SUPABASE_URL + '/rest/v1/technicians',
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            full_name: name,
            phone: phone,
            service_type: service
          })
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert('تم إرسال طلب انضمامك بنجاح! انتظر موافقة الإدارة.');
      this.reset();

    } catch (error) {
      alert('فشل تسجيل الفني: ' + error.message);
    } finally {
      button.disabled = false;
      button.textContent = 'إرسال طلب الانضمام';
    }
  });
}
0


// ============================
// حسابات خدماتي - Supabase Auth
// ============================

const authBox = document.createElement('div');
authBox.className = 'booking';
authBox.style.display = 'block';
authBox.innerHTML = `
<h3>🔐 حساب خدماتي</h3>
<input id="authEmail" type="email" placeholder="البريد الإلكتروني">
<input id="authPassword" type="password" placeholder="كلمة المرور">
<button id="authSignup">إنشاء حساب</button>
<button id="authLogin" style="margin-top:8px">تسجيل الدخول</button>
<p id="authMessage"></p>
`;
document.body.insertBefore(authBox, document.body.firstChild);

async function authRequest(action, data) {
  const response = await fetch(
    SUPABASE_URL + '/auth/v1/' + action,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || 'حدث خطأ');
  return result;
}

document.getElementById('authSignup').onclick = async () => {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const message = document.getElementById('authMessage');

  try {
    if (!email || password.length < 6) {
      throw new Error('اكتب بريدك وكلمة مرور من 6 أحرف على الأقل');
    }

    const result = await authRequest('signup', { email, password });

    if (result.access_token) {
      localStorage.setItem('khadamati_token', result.access_token);
    }

    message.textContent = 'تم إنشاء الحساب. راجع بريدك إذا طُلب تأكيده.';
  } catch (error) {
    message.textContent = error.message;
  }
};

document.getElementById('authLogin').onclick = async () => {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const message = document.getElementById('authMessage');

  try {
    const result = await authRequest('token?grant_type=password', {
      email,
      password
    });

    localStorage.setItem('khadamati_token', result.access_token);
    message.textContent = 'تم تسجيل الدخول بنجاح.';
  } catch (error) {
    message.textContent = error.message;
  }
};

// ============================
// متابعة طلبات العميل
// ============================
async function trackMyRequests() {
  const phone = document.getElementById('trackPhone').value.trim();
  const output = document.getElementById('myRequests');

  if (!phone) {
    alert('اكتب رقم الهاتف أولاً');
    return;
  }

  output.textContent = 'جاري البحث عن طلباتك...';

  try {
    const params = new URLSearchParams({
      select: 'id,service_type,status,created_at,address',
      phone: 'eq.' + phone,
      order: 'created_at.desc'
    });

    const response = await fetch(
      SUPABASE_URL + '/rest/v1/service_requests?' + params,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY
        }
      }
    );

    if (!response.ok) throw new Error(await response.text());

    const requests = await response.json();
    output.replaceChildren();

    if (!requests.length) {
      output.textContent = 'لا توجد طلبات مسجلة بهذا الرقم.';
      return;
    }

    requests.forEach(request => {
      const card = document.createElement('div');
      card.className = 'service';
      const details = document.createElement('p');
      details.textContent =
        'رقم الطلب: ' + request.id +
        ' | الخدمة: ' + request.service_type +
        ' | الحالة: ' + request.status;
      card.appendChild(details);
      output.appendChild(card);
    });
  } catch (error) {
    output.textContent = 'تعذر جلب الطلبات: ' + error.message;
  }
}

// ============================
// نظام تقييم الخدمة
// ============================
let selectedRating = 0;

document.querySelectorAll('#ratingStars button').forEach(button => {
  button.addEventListener('click', () => {
    selectedRating = Number(button.dataset.rating);
    document.querySelectorAll('#ratingStars button').forEach(star => {
      star.style.opacity =
        Number(star.dataset.rating) <= selectedRating ? '1' : '0.35';
    });
  });
});

async function submitRating() {
  const requestId = document.getElementById('ratingRequestId').value.trim();
  const comment = document.getElementById('ratingComment').value.trim();
  const message = document.getElementById('ratingMessage');

  if (!requestId || selectedRating < 1) {
    message.textContent = 'اكتب رقم الطلب واختر عدد النجوم.';
    return;
  }

  try {
    const response = await fetch(SUPABASE_URL + '/rest/v1/reviews', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        request_id: Number(requestId),
        rating: selectedRating,
        comment
      })
    });

    if (!response.ok) throw new Error(await response.text());

    message.textContent = 'تم حفظ تقييمك بنجاح ⭐';
    selectedRating = 0;
  } catch (error) {
    message.textContent = 'تعذر حفظ التقييم: ' + error.message;
  }
}

// ============================
// لوحة الفني واستقبال الطلبات
// ============================
async function loadTechnicianRequests() {
  const phone = document.getElementById('technicianPhone').value.trim();
  const output = document.getElementById('technicianRequests');

  if (!phone) {
    output.textContent = 'اكتب رقم هاتفك المسجل أولاً.';
    return;
  }

  output.textContent = 'جاري تحميل الطلبات...';

  try {
    const techResponse = await fetch(
      SUPABASE_URL + '/rest/v1/technicians?phone=eq.' +
      encodeURIComponent(phone) + '&select=id,service_type',
      { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
    );

    if (!techResponse.ok) throw new Error(await techResponse.text());

    const technicians = await techResponse.json();
    if (!technicians.length) throw new Error('رقم الفني غير مسجل.');

    const technician = technicians[0];
    const params = new URLSearchParams({
      select: 'id,customer_name,phone,address,service_type,created_at',
      status: 'eq.searching',
      service_type: 'eq.' + technician.service_type,
      order: 'created_at.desc'
    });

    const response = await fetch(
      SUPABASE_URL + '/rest/v1/service_requests?' + params,
      { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
    );

    if (!response.ok) throw new Error(await response.text());

    const requests = await response.json();
    output.replaceChildren();

    if (!requests.length) {
      output.textContent = 'لا توجد طلبات متاحة لخدمتك حاليًا.';
      return;
    }

    requests.forEach(request => {
      const card = document.createElement('div');
      card.className = 'service';

      const details = document.createElement('p');
      details.textContent = 'طلب #' + request.id +
        ' | ' + request.service_type +
        ' | العنوان: ' + request.address;

      const accept = document.createElement('button');
      accept.textContent = 'قبول الطلب';
      accept.onclick = () => acceptTechnicianRequest(request.id, technician.id, accept);

      card.append(details, accept);
      output.appendChild(card);
    });
  } catch (error) {
    output.textContent = 'تعذر تحميل الطلبات: ' + error.message;
  }
}

async function acceptTechnicianRequest(requestId, technicianId, button) {
  if (!confirm('هل تريد قبول هذا الطلب؟')) return;

  button.disabled = true;
  try {
    const response = await fetch(
      SUPABASE_URL + '/rest/v1/service_requests?id=eq.' +
      encodeURIComponent(requestId) + '&status=eq.searching',
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify({
          assigned_technician_id: technicianId,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) throw new Error(await response.text());

    const updated = await response.json();
    if (!updated.length) throw new Error('الطلب لم يعد متاحًا.');

    alert('تم قبول الطلب بنجاح.');
    loadTechnicianRequests();
  } catch (error) {
    alert('تعذر قبول الطلب: ' + error.message);
    button.disabled = false;
  }
}

// تحديث حالة الطلب بواسطة الفني
async function updateRequestStatus(requestId, status) {
  try {
    const response = await fetch(
      SUPABASE_URL + '/rest/v1/service_requests?id=eq.' + encodeURIComponent(requestId),
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({ status })
      }
    );

    if (!response.ok) throw new Error(await response.text());
    alert('تم تحديث حالة الطلب.');
  } catch (error) {
    alert('فشل تحديث الحالة: ' + error.message);
  }
}

// أزرار تحديث حالة الطلب
const originalLoadTechnicianRequests = loadTechnicianRequests;
loadTechnicianRequests = async function() {
  await originalLoadTechnicianRequests();

  document.querySelectorAll('#technicianRequests .service').forEach(card => {
    const details = card.querySelector('p');
    if (!details || card.querySelector('.status-actions')) return;

    const match = details.textContent.match(/طلب #(\d+)/);
    if (!match) return;

    const requestId = match[1];
    const actions = document.createElement('div');
    actions.className = 'status-actions';

    [
      ['في الطريق', 'on_the_way'],
      ['بدأت الخدمة', 'in_progress'],
      ['مكتمل', 'completed']
    ].forEach(([label, status]) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.onclick = () => updateRequestStatus(requestId, status);
      actions.appendChild(button);
    });

    card.appendChild(actions);
  });
};
