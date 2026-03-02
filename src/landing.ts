/**
 * IT Vendo Landing Page - TypeScript
 * Handles rotating text, scroll animations, contact forms, and mobile nav.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

interface RotatingTextConfig {
  containerId: string;
  items: readonly string[];
  intervalMs: number;
  activeClass: string;
  inactiveClass: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  plan?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ScrollRevealConfig {
  threshold: number;
  rootMargin: string;
  animationClass: string;
}

// ─── Rotating Text ─────────────────────────────────────────────────────────

function initRotatingText(config: RotatingTextConfig): void {
  const container = document.getElementById(config.containerId);
  if (!container) return;

  container.innerHTML = '';
  const items = [...config.items];
  let currentIndex = 0;

  // Build DOM: single visible span that we update
  const displayEl = document.createElement('span');
  displayEl.className = `rotating-text-display px-3 py-1.5 bg-purple-50 rounded-full text-brand-purple font-medium text-lg transition-opacity duration-500`;
  displayEl.textContent = items[0];
  container.appendChild(displayEl);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    displayEl.classList.add('opacity-0');
    setTimeout(() => {
      displayEl.textContent = items[currentIndex];
      displayEl.classList.remove('opacity-0');
    }, 300);
  }, config.intervalMs);
}

// ─── Scroll Reveal Animations ──────────────────────────────────────────────

function initScrollReveal(selector: string, config: Partial<ScrollRevealConfig> = {}): void {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    animationClass = 'animate-reveal',
  } = config;

  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
        }
      });
    },
    { threshold, rootMargin }
  );

  elements.forEach((el) => observer.observe(el));
}

// Styles for animations (injected at init)

// ─── Contact Form ──────────────────────────────────────────────────────────

function getFormElement<T extends HTMLElement>(formId: string, name: string): T | null {
  const form = document.getElementById(formId);
  if (!form) return null;
  return form.querySelector<T>(`[name="${name}"]`);
}

function validateForm(data: Partial<ContactFormData>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email');
  if (!data.message?.trim()) errors.push('Message is required');
  return errors;
}

function setFormStatus(form: HTMLFormElement, status: FormStatus, message?: string): void {
  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const statusEl = form.querySelector<HTMLDivElement>('.form-status');
  if (!submitBtn || !statusEl) return;

  submitBtn.disabled = status === 'submitting';

  statusEl.textContent = message ?? '';
  statusEl.className = 'form-status mt-3 text-sm ';
  switch (status) {
    case 'success':
      statusEl.classList.add('text-green-600');
      break;
    case 'error':
      statusEl.classList.add('text-red-600');
      break;
    default:
      statusEl.classList.add('text-gray-500');
  }
}

function initContactForm(formId: string, formspreeId: string): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.action = `https://formspree.io/f/${formspreeId}`;
  form.method = 'POST';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (getFormElement<HTMLInputElement>(formId, 'name')?.value ?? '').trim();
    const email = (getFormElement<HTMLInputElement>(formId, 'email')?.value ?? '').trim();
    const message = (getFormElement<HTMLTextAreaElement>(formId, 'message')?.value ?? '').trim();
    const plan = getFormElement<HTMLSelectElement>(formId, 'plan')?.value;

    const data: ContactFormData = { name, email, message, plan };
    const errors = validateForm(data);

    if (errors.length > 0) {
      setFormStatus(form, 'error', errors.join('. '));
      return;
    }

    setFormStatus(form, 'submitting', 'Sending...');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setFormStatus(form, 'success', 'Thanks! We\'ll get back to you soon.');
        form.reset();
      } else {
        setFormStatus(form, 'error', 'Something went wrong. Please try again.');
      }
    } catch {
      setFormStatus(form, 'error', 'Network error. Please try again.');
    }
  });
}

function initDemoForm(formId: string, formspreeId: string): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.action = `https://formspree.io/f/${formspreeId}`;
  form.method = 'POST';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (getFormElement<HTMLInputElement>(formId, 'name')?.value ?? '').trim();
    const email = (getFormElement<HTMLInputElement>(formId, 'email')?.value ?? '').trim();
    const phone = (getFormElement<HTMLInputElement>(formId, 'phone')?.value ?? '').trim();
    const plan = getFormElement<HTMLSelectElement>(formId, 'plan')?.value;
    const app = getFormElement<HTMLInputElement>(formId, 'app')?.value;

    if (!name || !email) {
      const statusEl = form.querySelector<HTMLDivElement>('.form-status');
      if (statusEl) {
        statusEl.textContent = 'Please enter your name and email.';
        statusEl.className = 'form-status mt-3 text-sm text-red-600';
      }
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const statusEl = form.querySelector<HTMLDivElement>('.form-status');
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) {
      statusEl.textContent = 'Sending your demo request...';
      statusEl.className = 'form-status mt-3 text-sm text-gray-600';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, plan: plan || app, type: 'demo' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        if (statusEl) {
          statusEl.textContent = "Thanks! We'll reach out within 24 hours to schedule your demo.";
          statusEl.className = 'form-status mt-3 text-sm text-green-600';
        }
        form.reset();
        document.getElementById('demo-modal')?.classList.add('hidden');
      } else {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong. Please try again.';
          statusEl.className = 'form-status mt-3 text-sm text-red-600';
        }
      }
    } catch {
      if (statusEl) {
        statusEl.textContent = 'Network error. Please try again.';
        statusEl.className = 'form-status mt-3 text-sm text-red-600';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ─── Mobile Navigation ─────────────────────────────────────────────────────

function initMobileNav(): void {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden', expanded);
    menu.classList.toggle('flex', !expanded);
  });

  // Close on link click (mobile)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      menu.classList.remove('flex');
    });
  });
}

// ─── Modal for Forms ───────────────────────────────────────────────────────

function initFormModals(): void {
  const openTriggers = document.querySelectorAll<HTMLElement>('[data-modal-open]');
  const closeTriggers = document.querySelectorAll<HTMLElement>('[data-modal-close]');

  openTriggers.forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-modal-open');
      const plan = el.getAttribute('data-plan');
      if (targetId) document.getElementById(targetId)?.classList.remove('hidden');
      if (plan && targetId === 'trial-modal') {
        const planSelect = document.querySelector<HTMLSelectElement>('#trial-plan');
        if (planSelect) planSelect.value = plan;
      }
    });
  });

  closeTriggers.forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-modal-close');
      if (targetId) document.getElementById(targetId)?.classList.add('hidden');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[id$="-modal"]').forEach((modal) => {
        modal.classList.add('hidden');
      });
    }
  });
}

// ─── Smooth Scroll ─────────────────────────────────────────────────────────

function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── Init ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .animate-reveal { opacity: 1 !important; transform: translateY(0) !important; }
    .rotating-text-display { display: inline-block; min-width: 200px; text-align: center; }
  `;
  document.head.appendChild(style);

  const ROTATING_TEXTS = [
    'RxAudit - Pharmacy',
    'DentalCare Pro',
    'MedSched',
    'LabFlow',
    'EduManage',
    'BeautyBook',
    'FoodFlow',
    'RetailPro',
    'GymMaster',
    'PropManager',
  ] as const;

  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // Replace with your Formspree form ID

  initRotatingText({
    containerId: 'rotating-text',
    items: ROTATING_TEXTS,
    intervalMs: 2500,
    activeClass: 'opacity-100',
    inactiveClass: 'opacity-50',
  });

  initScrollReveal('.animate-on-scroll');
  initScrollReveal('.app-card', { threshold: 0.2 });

  initContactForm('contact-form', FORMSPREE_ID);
  initContactForm('contact-form-modal', FORMSPREE_ID);
  initDemoForm('demo-form', FORMSPREE_ID);

  initMobileNav();
  initFormModals();
  initSmoothScroll();
});
