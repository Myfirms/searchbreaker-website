/**
 * Client behavior for WaitlistForm + WaitlistDialog (vanilla, no framework).
 * - Any element with [data-waitlist-open] opens the dialog and passes its data-waitlist-source.
 * - Every [data-waitlist-form] is a small state machine: idle → submitting → success | duplicate | error.
 * Payload: { email, role|null, consent: true, source }. The endpoint answers 2xx JSON { result: 'success' | 'duplicate' }.
 */
import type { WaitlistPayload } from './types';

type Result = 'success' | 'duplicate' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function q<T extends Element>(root: ParentNode, sel: string): T {
  return root.querySelector(sel) as T;
}

async function send(endpoint: string, payload: WaitlistPayload): Promise<Result> {
  if (!endpoint) return 'error';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return 'error';
    const data = (await res.json()) as { result?: string };
    return data.result === 'duplicate' ? 'duplicate' : data.result === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

function initForm(root: HTMLElement) {
  if (root.dataset.wlReady) return;
  root.dataset.wlReady = 'true';

  const form = q<HTMLFormElement>(root, 'form');
  const email = q<HTMLInputElement>(root, '[data-wl-email]');
  const consent = q<HTMLInputElement>(root, '[data-wl-consent]');
  const role = form.querySelector<HTMLSelectElement>('select[name="role"]');
  const sourceInput = q<HTMLInputElement>(root, '[data-wl-source]');
  const emailError = q<HTMLElement>(root, '[data-wl-email-error]');
  const emailErrorText = q<HTMLElement>(root, '[data-wl-email-error-text]');
  const emailHint = q<HTMLElement>(root, '[data-wl-email-desc]');
  const consentError = q<HTMLElement>(root, '[data-wl-consent-error]');
  const serverError = q<HTMLElement>(root, '[data-wl-server-error]');
  const errorTitle = q<HTMLElement>(root, '[data-wl-error-title]');
  const errorText = q<HTMLElement>(root, '[data-wl-error-text]');
  const success = q<HTMLElement>(root, '[data-wl-success]');
  const duplicate = q<HTMLElement>(root, '[data-wl-duplicate]');
  const submit = q<HTMLButtonElement>(root, 'button[type="submit"]');
  const submitLabel = submit.textContent?.trim() ?? 'Join the waitlist';
  const reset = duplicate.querySelector<HTMLButtonElement>('button');

  const setStatus = (status: 'idle' | 'submitting' | 'success' | 'duplicate' | 'error') => {
    root.dataset.status = status;
    const busy = status === 'submitting';
    submit.toggleAttribute('aria-busy', busy);
    submit.setAttribute('aria-disabled', busy ? 'true' : 'false');
    submit.textContent = busy ? 'Joining…' : submitLabel;
    serverError.hidden = status !== 'error';
    success.hidden = status !== 'success';
    duplicate.hidden = status !== 'duplicate';
  };

  const showEmailError = (message: string | null) => {
    emailError.hidden = !message;
    emailHint.hidden = !!message;
    emailErrorText.textContent = message ?? '';
    email.toggleAttribute('aria-invalid', !!message);
    if (message) email.setAttribute('aria-invalid', 'true');
    email.setAttribute('aria-describedby', message ? emailError.id || (emailError.id = `${email.id}-err`) : emailHint.id);
  };

  email.addEventListener('input', () => showEmailError(null));
  consent.addEventListener('change', () => {
    consentError.hidden = true;
    consent.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (root.dataset.status === 'submitting') return;

    const value = email.value.trim();
    let emailMessage: string | null = null;
    if (!value) emailMessage = 'Enter your email address.';
    else if (!EMAIL_RE.test(value)) emailMessage = 'Enter a full email address, like name@example.com.';
    showEmailError(emailMessage);
    consentError.hidden = consent.checked;
    if (!consent.checked) consent.setAttribute('aria-invalid', 'true');
    if (emailMessage) return void email.focus();
    if (!consent.checked) return void consent.focus();

    const endpoint = root.dataset.endpoint ?? '';
    const payload: WaitlistPayload = {
      email: value,
      role: role?.value || null,
      consent: true,
      source: sourceInput.value || 'unknown',
    };

    setStatus('submitting');
    const result = await send(endpoint, payload);
    if (result === 'error') {
      errorTitle.textContent = endpoint ? "We couldn't add you right now" : "The waitlist isn't open yet";
      errorText.textContent = endpoint
        ? 'Your details are still here. Try again in a minute.'
        : 'Sign-ups are not being accepted at the moment. Please check back soon.';
    }
    root.querySelectorAll<HTMLElement>('[data-wl-email-echo]').forEach((el) => (el.textContent = value));
    setStatus(result);
    (result === 'success' ? success : result === 'duplicate' ? duplicate : email).focus?.();
  });

  reset?.addEventListener('click', () => {
    email.value = '';
    consent.checked = false;
    showEmailError(null);
    setStatus('idle');
    email.focus();
  });
}

function initDialog(dialog: HTMLDialogElement) {
  if (dialog.dataset.wdReady) return;
  dialog.dataset.wdReady = 'true';
  const sourceInput = dialog.querySelector<HTMLInputElement>('[data-wl-source]');

  // Backdrop click closes; a click inside the panel never reaches the <dialog> element itself.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('[data-waitlist-close]').forEach((btn) => btn.addEventListener('click', () => dialog.close()));

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-waitlist-open]');
    if (!trigger) return;
    e.preventDefault();
    if (sourceInput) sourceInput.value = trigger.dataset.waitlistSource || 'unknown';
    if (!dialog.open) dialog.showModal();
  });
}

function boot() {
  document.querySelectorAll<HTMLElement>('[data-waitlist-form]').forEach(initForm);
  document.querySelectorAll<HTMLDialogElement>('dialog[data-waitlist-dialog]').forEach(initDialog);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
