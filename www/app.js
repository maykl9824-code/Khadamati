const SUPABASE_URL = 'https://vrhyyogfzenzgdiiduhx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rqAcMpzMNV_Tcsw4mzrO3A_aCpCMgmo';

async function bookService(service) {
  const name = prompt("اكتب اسمك:");
  if (!name) return;

  const phone = prompt("اكتب رقم هاتفك:");
  if (!phone) return;

  const address = prompt("اكتب عنوانك:");
  if (!address) return;

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
          service_type: service
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert("تم حفظ طلبك بنجاح!");
  } catch (error) {
    alert("فشل حفظ الطلب: " + error.message);
  }
}
