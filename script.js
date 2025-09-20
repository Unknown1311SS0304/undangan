// ===== Personalization via ?to=Nama =====
const params = new URLSearchParams(location.search);
const to = params.get('to');
if (to) {
  document.title = `Undangan Aqiqah untuk ${decodeURIComponent(to)} — Aqila`;
  const dear = document.getElementById('dear');
  if (dear) dear.innerHTML = `Kepada Yth. <span class="font-semibold">${decodeURIComponent(to)}</span>`;
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.value = decodeURIComponent(to);
}

// ===== Sticky nav style & reveal on scroll =====
const nav = document.getElementById('nav');
function onScroll() {
  if (window.scrollY > 10) nav?.classList.add('blur-nav'); else nav?.classList.remove('blur-nav');
  document.querySelectorAll('.reveal').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80) el.classList.add('show');
  });
}
window.addEventListener('scroll', onScroll); onScroll();

// ===== Floating petals =====
const petalsContainer = document.getElementById('petals');
if (petalsContainer){
  for(let i=0; i<20; i++){
    const p = document.createElement('span'); p.className='petal';
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (8 + Math.random()*6) + 's';
    p.style.animationDelay = (-Math.random()*8) + 's';
    p.style.opacity = .3 + Math.random()*0.6;
    petalsContainer.appendChild(p);
  }
}

// ===== Countdown (event: 27 Sep 2025 10:00 WIB) =====
const eventTime = new Date('2025-09-27T10:00:00+07:00').getTime();
const ctn = document.getElementById('countdown');
function tick(){
  const now = Date.now();
  let diff = Math.max(0, eventTime - now);
  const d = Math.floor(diff/86400000); diff -= d*86400000;
  const h = Math.floor(diff/3600000); diff -= h*3600000;
  const m = Math.floor(diff/60000); diff -= m*60000;
  const s = Math.floor(diff/1000);
  if (ctn) ctn.textContent = `${d} hari ${h} jam ${m} menit ${s} detik`;
}
tick(); setInterval(tick, 1000);

// ===== Share API =====
const shareBtn = document.getElementById('shareBtn');
shareBtn?.addEventListener('click', async ()=>{
  const shareData = { title: document.title, text: 'Undangan Aqiqah Aqila — Sabtu, 27 Sep 2025', url: location.href };
  if (navigator.share) { try{ await navigator.share(shareData);}catch(e){} }
  else { await navigator.clipboard.writeText(location.href); shareBtn.textContent='Tautan Disalin'; setTimeout(()=>shareBtn.textContent='Bagikan',1500); }
});

// ===== Add to Calendar (ICS download) =====
const calendarBtn = document.getElementById('calendarBtn');
calendarBtn?.addEventListener('click', ()=>{
  const pad = n=> String(n).padStart(2,'0');
  const start = new Date('2025-09-27T10:00:00+07:00');
  const end = new Date('2025-09-27T12:00:00+07:00');
  function toICS(dt){
    const y=dt.getUTCFullYear(); const mo=pad(dt.getUTCMonth()+1); const d=pad(dt.getUTCDate());
    const h=pad(dt.getUTCHours()); const mi=pad(dt.getUTCMinutes()); const s=pad(dt.getUTCSeconds());
    return `${y}${mo}${d}T${h}${mi}${s}Z`;
  }
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Aqiqah Aqila//ID\nBEGIN:VEVENT\nUID:${Date.now()}@aqiqah-aqila\nDTSTAMP:${toICS(new Date())}\nDTSTART:${toICS(start)}\nDTEND:${toICS(end)}\nSUMMARY:Undangan Aqiqah — Aqila Arumi Khairunnisa\nLOCATION:Jl. Purwodadi No.89, Pekanbaru\nDESCRIPTION:Undangan aqiqah putri kami, Aqila Arumi Khairunnisa.\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='Aqiqah-Aqila-2025-09-27.ics'; a.click(); URL.revokeObjectURL(url);
});

// ===== RSVP actions (WhatsApp) =====
const phone = '6281363769937'; // Nomor WA tujuan (tanpa +)

function buildMessage(){
  const n = document.getElementById('name')?.value || 'Tamu Undangan';
  const c = document.getElementById('count')?.value || '1';
  const m = document.getElementById('message')?.value || '';
  return `Assalamu%27alaikum.%20Saya%20${encodeURIComponent(n)}.%0AIngin%20konfirmasi%20kehadiran%20(${encodeURIComponent(c)}%20orang).%0A${encodeURIComponent(m)}%0A- dikirim dari undangan aqiqah -`;
}
document.getElementById('waBtn')?.addEventListener('click', ()=>{
  const url = `https://wa.me/6281363769937?text=${buildMessage()}`;
  window.open(url, '_blank');
});

// ===== Music toggle =====
const bgm = document.getElementById('bgm');
const musicToggle = document.getElementById('musicToggle');
let playing = false;
musicToggle?.addEventListener('click', async ()=>{
  try{
    if(!playing){ await bgm.play(); playing=true; musicToggle.textContent='⏸ Musik'; }
    else { bgm.pause(); playing=false; musicToggle.textContent='♫ Musik'; }
  }catch(e){ alert('Tambahkan file musik di tag <audio> untuk mengaktifkan.'); }
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
    }
  });
});
