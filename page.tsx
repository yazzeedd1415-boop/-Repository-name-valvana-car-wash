"use client";

import { FormEvent, useMemo, useState } from "react";

type View = "overview" | "booking" | "orders" | "customers" | "services";
type Payment = "network" | "cash";
type BookingStatus = "مؤكد" | "قيد الغسيل" | "بانتظار الوصول" | "مكتمل";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  tag?: string;
};

type Booking = {
  id: string;
  customer: string;
  phone: string;
  car: string;
  plate: string;
  serviceId: string;
  time: string;
  payment: Payment;
  status: BookingStatus;
  total: number;
  isReward?: boolean;
};

const services: Service[] = [
  {
    id: "outside",
    name: "الغسيل الخارجي",
    description: "غسيل الهيكل والجنوط مع تنشيف احترافي",
    price: 35,
    duration: "25 دقيقة",
  },
  {
    id: "complete",
    name: "الغسيل الشامل",
    description: "غسيل خارجي، تنظيف داخلي وتعطير السيارة",
    price: 65,
    duration: "45 دقيقة",
    tag: "الأكثر طلباً",
  },
  {
    id: "vip",
    name: "غسيل VIP",
    description: "غسيل شامل، تلميع الإطارات وحماية الطبلون",
    price: 95,
    duration: "60 دقيقة",
    tag: "عناية متكاملة",
  },
  {
    id: "deep",
    name: "تنظيف داخلي عميق",
    description: "تنظيف المقاعد والأرضيات والسقف بالبخار",
    price: 145,
    duration: "90 دقيقة",
  },
];

const loyaltyCustomers = [
  { name: "سلمان القحطاني", phone: "0501234567", stamps: 3, visits: 12 },
  { name: "محمد الدوسري", phone: "0557261840", stamps: 2, visits: 8 },
  { name: "عبدالله الشمري", phone: "0538402197", stamps: 1, visits: 5 },
  { name: "خالد العتيبي", phone: "0561903472", stamps: 0, visits: 4 },
];

const initialBookings: Booking[] = [
  {
    id: "CW-1048",
    customer: "سلمان القحطاني",
    phone: "0501234567",
    car: "تويوتا لاندكروزر",
    plate: "ر س ب 4812",
    serviceId: "complete",
    time: "10:30 ص",
    payment: "network",
    status: "قيد الغسيل",
    total: 0,
    isReward: true,
  },
  {
    id: "CW-1049",
    customer: "نواف الحربي",
    phone: "0553901224",
    car: "مرسيدس S450",
    plate: "ح ن د 7750",
    serviceId: "vip",
    time: "11:15 ص",
    payment: "network",
    status: "مؤكد",
    total: 95,
  },
  {
    id: "CW-1050",
    customer: "عبدالله الشمري",
    phone: "0538402197",
    car: "هيونداي سوناتا",
    plate: "ا و ك 2136",
    serviceId: "outside",
    time: "12:00 م",
    payment: "cash",
    status: "بانتظار الوصول",
    total: 35,
  },
];

const navItems: { id: View; label: string; code: string }[] = [
  { id: "overview", label: "نظرة عامة", code: "01" },
  { id: "booking", label: "حجز جديد", code: "02" },
  { id: "orders", label: "الحجوزات", code: "03" },
  { id: "customers", label: "العملاء والولاء", code: "04" },
  { id: "services", label: "الخدمات والأسعار", code: "05" },
];

const statusClass: Record<BookingStatus, string> = {
  "مؤكد": "confirmed",
  "قيد الغسيل": "washing",
  "بانتظار الوصول": "waiting",
  "مكتمل": "completed",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedService, setSelectedService] = useState("complete");
  const [payment, setPayment] = useState<Payment>("network");
  const [phone, setPhone] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const selected = services.find((item) => item.id === selectedService) ?? services[1];
  const loyaltyProfile = loyaltyCustomers.find((customer) => customer.phone === phone);
  const rewardAvailable = loyaltyProfile?.stamps === 3;

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.total, 0),
    [bookings],
  );

  function openBooking(serviceId?: string) {
    if (serviceId) setSelectedService(serviceId);
    setSuccessId(null);
    setView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = `CW-${1051 + bookings.length}`;
    const customer = String(data.get("customer"));
    const vehicle = String(data.get("vehicle"));
    const plate = String(data.get("plate"));
    const date = String(data.get("date"));
    const time = String(data.get("time"));
    const isReward = Boolean(rewardAvailable);

    setBookings((current) => [
      {
        id,
        customer,
        phone,
        car: vehicle,
        plate,
        serviceId: selected.id,
        time: `${date} • ${time}`,
        payment,
        status: "مؤكد",
        total: isReward ? 0 : selected.price,
        isReward,
      },
      ...current,
    ]);
    setSuccessId(id);
  }

  return (
    <main className="app-shell" dir="rtl">
      <aside className="sidebar" aria-label="التنقل الرئيسي">
        <button className="brand" onClick={() => setView("overview")} aria-label="الرئيسية">
          <span className="brand-mark"><i /></span>
          <span>
            <strong>VALVANA</strong>
            <small>WASH MANAGEMENT</small>
          </span>
        </button>

        <div className="branch-card">
          <span className="eyebrow">الفرع الحالي</span>
          <strong>فرع النرجس — الرياض</strong>
          <span className="live"><i /> مفتوح الآن</span>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => setView(item.id)}
            >
              <span>{item.label}</span>
              <b>{item.code}</b>
            </button>
          ))}
        </nav>

        <div className="loyalty-mini">
          <span>برنامج الولاء</span>
          <strong>٣ غسلات + الرابعة مجاناً</strong>
          <div className="mini-stamps"><i /><i /><i /><i className="gift" /></div>
        </div>

        <p className="sidebar-note">الدفع بعد الحجز<br />شبكة أو كاش فقط</p>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">الأحد، ٩ أغسطس ٢٠٢٦</p>
            <h1>{navItems.find((item) => item.id === view)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" aria-label="التنبيهات">التنبيهات <span>٣</span></button>
            <button className="primary-button" onClick={() => openBooking()}>+ حجز جديد</button>
            <div className="avatar">ي</div>
          </div>
        </header>

        {view === "overview" && (
          <div className="page-content">
            <section className="hero-panel">
              <div className="hero-copy">
                <p className="eyebrow gold">لوحة التشغيل اليومية</p>
                <h2>كل غسلة محسوبة.<br /><span>وكل عميل يعود.</span></h2>
                <p>إدارة الحجوزات والمدفوعات وبرنامج الولاء من شاشة واحدة واضحة.</p>
                <button className="primary-button large" onClick={() => openBooking()}>إنشاء حجز الآن</button>
              </div>
              <div className="hero-orbit" aria-hidden="true">
                <div className="orbit-ring ring-one" />
                <div className="orbit-ring ring-two" />
                <div className="car-silhouette">
                  <span className="car-roof" />
                  <span className="car-body" />
                  <i className="wheel-one" /><i className="wheel-two" />
                </div>
                <span className="spark s1">✦</span><span className="spark s2">✦</span>
              </div>
            </section>

            <section className="stats-grid">
              <article>
                <span className="metric-label">حجوزات اليوم</span>
                <strong>{bookings.length + 9}</strong>
                <small><b>+18%</b> عن أمس</small>
              </article>
              <article>
                <span className="metric-label">إيرادات اليوم</span>
                <strong>{formatPrice(totalRevenue + 1645)} <em>ر.س</em></strong>
                <small>شبكة 74% · كاش 26%</small>
              </article>
              <article>
                <span className="metric-label">المركبات المكتملة</span>
                <strong>٩ <em>/ ١٢</em></strong>
                <small>متوسط الغسيل ٤٢ دقيقة</small>
              </article>
              <article className="reward-stat">
                <span className="metric-label">غسلات مجانية اليوم</span>
                <strong>٣</strong>
                <small>مكافآت ولاء مستحقة</small>
              </article>
            </section>

            <section className="two-column">
              <div className="panel queue-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">المسار التشغيلي</p><h3>حجوزات اليوم</h3></div>
                  <button onClick={() => setView("orders")}>عرض الكل ←</button>
                </div>
                <div className="booking-list">
                  {bookings.slice(0, 3).map((booking) => (
                    <BookingRow booking={booking} key={booking.id} />
                  ))}
                </div>
              </div>

              <div className="panel loyalty-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">برنامج الاحتفاظ</p><h3>بطاقة الولاء</h3></div>
                  <span className="gold-pill">نشط</span>
                </div>
                <div className="loyalty-card">
                  <div className="loyalty-head">
                    <span className="brand-mark small"><i /></span>
                    <div><small>عميل مميز</small><strong>سلمان القحطاني</strong></div>
                    <b>GOLD</b>
                  </div>
                  <div className="stamps">
                    {[1, 2, 3].map((number) => <span className="stamp done" key={number}>✓<small>{number}</small></span>)}
                    <span className="stamp reward">هدية<small>٤</small></span>
                  </div>
                  <div className="reward-message"><strong>الغسلة القادمة مجاناً</strong><span>اكتملت ٣ غسلات مدفوعة</span></div>
                </div>
                <p className="policy-note"><b>قاعدة البرنامج:</b> كل ثلاث غسلات مدفوعة، يحصل العميل على الغسلة الرابعة مجاناً بنفس فئة آخر خدمة أو أقل.</p>
              </div>
            </section>
          </div>
        )}

        {view === "booking" && (
          <div className="page-content booking-page">
            {successId ? (
              <section className="success-card">
                <div className="success-icon">✓</div>
                <p className="eyebrow gold">تم استلام الحجز</p>
                <h2>حجزك مؤكد بنجاح</h2>
                <p>رقم الحجز <strong>{successId}</strong>. السداد سيكون بعد الحجز في الفرع عن طريق الشبكة أو الكاش.</p>
                <div className="success-actions">
                  <button className="primary-button" onClick={() => setView("orders")}>عرض الحجوزات</button>
                  <button className="secondary-button" onClick={() => setSuccessId(null)}>حجز آخر</button>
                </div>
              </section>
            ) : (
              <form className="booking-layout" onSubmit={submitBooking}>
                <section className="booking-form panel">
                  <div className="section-title"><span>١</span><div><p className="eyebrow">بيانات العميل</p><h2>من سنخدم اليوم؟</h2></div></div>
                  <div className="form-grid">
                    <label><span>اسم العميل</span><input name="customer" required placeholder="الاسم الكامل" /></label>
                    <label><span>رقم الجوال</span><input name="phone" required inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05xxxxxxxx" /></label>
                    <label><span>نوع السيارة</span><input name="vehicle" required placeholder="مثال: تويوتا لاندكروزر" /></label>
                    <label><span>رقم اللوحة</span><input name="plate" required placeholder="أ ب ج 1234" /></label>
                  </div>

                  <div className="divider" />
                  <div className="section-title"><span>٢</span><div><p className="eyebrow">الخدمة المطلوبة</p><h2>اختر نوع الغسيل</h2></div></div>
                  <div className="service-select-grid">
                    {services.map((service) => (
                      <button type="button" className={selectedService === service.id ? "selected" : ""} onClick={() => setSelectedService(service.id)} key={service.id}>
                        {service.tag && <em>{service.tag}</em>}
                        <strong>{service.name}</strong>
                        <small>{service.duration}</small>
                        <b>{formatPrice(service.price)} <i>ر.س</i></b>
                      </button>
                    ))}
                  </div>

                  <div className="divider" />
                  <div className="section-title"><span>٣</span><div><p className="eyebrow">الموعد والسداد</p><h2>حدد الوقت وطريقة الدفع</h2></div></div>
                  <div className="form-grid compact">
                    <label><span>التاريخ</span><input name="date" type="date" required defaultValue="2026-08-10" /></label>
                    <label><span>الوقت</span><select name="time" required defaultValue="10:00"><option>10:00</option><option>10:30</option><option>11:00</option><option>11:30</option><option>12:00</option><option>16:00</option><option>16:30</option><option>17:00</option></select></label>
                  </div>
                  <div className="payment-options">
                    <button type="button" className={payment === "network" ? "selected" : ""} onClick={() => setPayment("network")}><span className="payment-symbol">▰</span><div><strong>الدفع بالشبكة</strong><small>بعد الحجز في الفرع</small></div><i /></button>
                    <button type="button" className={payment === "cash" ? "selected" : ""} onClick={() => setPayment("cash")}><span className="payment-symbol">﷼</span><div><strong>الدفع كاش</strong><small>بعد الحجز في الفرع</small></div><i /></button>
                  </div>
                </section>

                <aside className="booking-summary">
                  <div className="summary-card">
                    <p className="eyebrow">ملخص الحجز</p>
                    <h3>{selected.name}</h3>
                    <p>{selected.description}</p>
                    <dl>
                      <div><dt>مدة الخدمة</dt><dd>{selected.duration}</dd></div>
                      <div><dt>طريقة الدفع</dt><dd>{payment === "network" ? "الشبكة" : "كاش"}</dd></div>
                      <div><dt>موعد السداد</dt><dd>بعد الحجز</dd></div>
                    </dl>
                    {loyaltyProfile && (
                      <div className={rewardAvailable ? "loyalty-alert reward-ready" : "loyalty-alert"}>
                        <div><strong>{rewardAvailable ? "مبروك! الغسلة مجانية" : `${loyaltyProfile.stamps} من 3 غسلات`}</strong><span>{rewardAvailable ? "تم تطبيق مكافأة الولاء" : "باقي لك غسلات حتى المكافأة"}</span></div>
                        <div className="tiny-progress">{[1, 2, 3].map((n) => <i className={n <= loyaltyProfile.stamps ? "filled" : ""} key={n} />)}<i className="gift" /></div>
                      </div>
                    )}
                    <div className="total-line"><span>الإجمالي</span><strong className={rewardAvailable ? "old-price" : ""}>{formatPrice(selected.price)} <i>ر.س</i></strong></div>
                    {rewardAvailable && <div className="free-total"><span>بعد المكافأة</span><strong>مجاناً</strong></div>}
                    <button className="primary-button submit" type="submit">تأكيد الحجز</button>
                    <small className="safe-note">لا يتم خصم أي مبلغ إلكترونياً. السداد شبكة أو كاش بعد الحجز.</small>
                  </div>
                </aside>
              </form>
            )}
          </div>
        )}

        {view === "orders" && (
          <div className="page-content">
            <section className="panel table-panel">
              <div className="panel-heading"><div><p className="eyebrow">المتابعة اليومية</p><h3>جميع الحجوزات</h3></div><button className="primary-button" onClick={() => openBooking()}>+ إضافة حجز</button></div>
              <div className="orders-table">
                <div className="table-row table-head"><span>الحجز والعميل</span><span>السيارة</span><span>الخدمة</span><span>السداد</span><span>الحالة</span><span>الإجمالي</span></div>
                {bookings.map((booking) => {
                  const service = services.find((item) => item.id === booking.serviceId);
                  return <div className="table-row" key={booking.id}>
                    <span><strong>{booking.customer}</strong><small>{booking.id} · {booking.time}</small></span>
                    <span><strong>{booking.car}</strong><small>{booking.plate}</small></span>
                    <span><strong>{service?.name}</strong><small>{service?.duration}</small></span>
                    <span><strong>{booking.payment === "network" ? "شبكة" : "كاش"}</strong><small>بعد الحجز</small></span>
                    <span><b className={`status ${statusClass[booking.status]}`}>{booking.status}</b></span>
                    <span><strong className={booking.isReward ? "gold-text" : ""}>{booking.isReward ? "مجاني" : `${formatPrice(booking.total)} ر.س`}</strong><small>{booking.isReward ? "مكافأة ولاء" : "بانتظار السداد"}</small></span>
                  </div>;
                })}
              </div>
            </section>
          </div>
        )}

        {view === "customers" && (
          <div className="page-content">
            <section className="customer-intro"><div><p className="eyebrow gold">برنامج الولاء</p><h2>كل ٣ غسلات، الرابعة علينا.</h2><p>يتعرف النظام على العميل من رقم جواله ويحسب الغسلات المكتملة تلقائياً.</p></div><div className="big-four">٤<small>مجاناً</small></div></section>
            <section className="customer-grid">
              {loyaltyCustomers.map((customer) => (
                <article className="customer-card" key={customer.phone}>
                  <div className="customer-head"><span>{customer.name.charAt(0)}</span><div><strong>{customer.name}</strong><small>{customer.phone} · {customer.visits} زيارة</small></div></div>
                  <div className="customer-progress"><div>{[1, 2, 3].map((n) => <i className={n <= customer.stamps ? "filled" : ""} key={n}>{n <= customer.stamps ? "✓" : n}</i>)}<i className={customer.stamps === 3 ? "gift ready" : "gift"}>٤</i></div><span>{customer.stamps === 3 ? "الغسلة القادمة مجانية" : `${customer.stamps} من 3 غسلات`}</span></div>
                </article>
              ))}
            </section>
          </div>
        )}

        {view === "services" && (
          <div className="page-content">
            <section className="services-header"><p className="eyebrow gold">قائمة الخدمات</p><h2>أسعار واضحة، وخيارات تناسب كل سيارة.</h2><p>يمكن تغيير الأسعار وربطها بحجم المركبة لاحقاً من إعدادات النظام.</p></section>
            <section className="services-grid">
              {services.map((service, index) => (
                <article className={service.tag ? "featured" : ""} key={service.id}>
                  <div className="service-number">0{index + 1}</div>
                  {service.tag && <span className="service-tag">{service.tag}</span>}
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <ul><li>فحص جودة قبل التسليم</li><li>مواد آمنة على السيارة</li><li>ضمان رضا العميل</li></ul>
                  <div className="service-bottom"><span><strong>{formatPrice(service.price)}</strong> ر.س<small>{service.duration}</small></span><button onClick={() => openBooking(service.id)}>احجز ←</button></div>
                </article>
              ))}
            </section>
          </div>
        )}
      </section>

      <nav className="mobile-nav" aria-label="التنقل للجوال">
        {navItems.slice(0, 4).map((item) => <button className={view === item.id ? "active" : ""} onClick={() => setView(item.id)} key={item.id}><b>{item.code}</b><span>{item.label}</span></button>)}
      </nav>
    </main>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const service = services.find((item) => item.id === booking.serviceId);
  return (
    <article className="booking-row">
      <div className="time-box"><strong>{booking.time.replace(/\s[صم]$/, "")}</strong><span>{booking.time.endsWith("م") ? "م" : "ص"}</span></div>
      <div className="booking-person"><strong>{booking.customer}</strong><small>{booking.car} · {booking.plate}</small></div>
      <div className="booking-service"><strong>{service?.name}</strong><small>{booking.payment === "network" ? "شبكة" : "كاش"} بعد الحجز</small></div>
      <b className={`status ${statusClass[booking.status]}`}>{booking.status}</b>
      <strong className={booking.isReward ? "gold-text" : "price-cell"}>{booking.isReward ? "مجاني" : `${booking.total} ر.س`}</strong>
    </article>
  );
}
