const services = [
  "الكهرباء",
  "السباكة",
  "التكييف والتبريد",
  "النجارة",
  "النقاشة والدهانات",
  "الغاز",
  "التنظيف",
  "خدمات أخرى"
];

function bookService(service) {
  const name = prompt("اكتب اسمك:");
  if (!name) return;

  const phone = prompt("اكتب رقم هاتفك:");
  if (!phone) return;

  const address = prompt("اكتب عنوانك:");
  if (!address) return;

  alert(
    "تم تسجيل طلبك بنجاح!\n" +
    "الخدمة: " + service +
    "\nالاسم: " + name +
    "\nرقم الهاتف: " + phone +
    "\nالعنوان: " + address
  );
}
0

