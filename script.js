// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.12});
revealEls.forEach(el=>io.observe(el));

// Contact form submission (only runs if a contact form exists on the page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const cfStatus = document.getElementById('cf-status');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const payload = {
      name: document.getElementById('cf-name').value,
      email: document.getElementById('cf-email').value,
      company: document.getElementById('cf-company').value,
      service: document.getElementById('cf-service').value,
      message: document.getElementById('cf-message').value
    };
    submitBtn.disabled = true;
    cfStatus.textContent = 'Sending…';
    cfStatus.className = 'form-status loading';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        cfStatus.textContent = "Thanks — we'll be in touch shortly.";
        cfStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      cfStatus.textContent = 'Could not send — please try again or email us directly.';
      cfStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
