# Frontend Coding Agent Guidelines — Healthcare Compliance

**MANDATORY: Read and apply these rules to EVERY frontend code change.**  
**Frameworks:** HIPAA, HITRUST, SOC 2, PCI DSS, OWASP, WCAG 2.1 AA  

---

## RULE 1: Never Store Tokens in Browser Storage

**CHECK BEFORE EVERY CHANGE:** Does this code read or write to `localStorage` or `sessionStorage`?

```typescript
// ❌ PROHIBITED — auditor-flagged violation (HIPAA §164.312(a)(2)(iv))
localStorage.setItem('userToken', token);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('tenantId', tenantId);
sessionStorage.setItem('userData', JSON.stringify(user));

// ✅ REQUIRED — use HttpOnly cookies (set by backend)
// Frontend should NOT manage token storage at all.
// If SPA requires in-memory access, use module-scoped variable:
let _accessToken: string | null = null;
export const setToken = (token: string) => { _accessToken = token; };
export const getToken = () => _accessToken;
export const clearToken = () => { _accessToken = null; };
// Clear on page unload:
window.addEventListener('beforeunload', clearToken);
```

**Validation command:**
```bash
grep -rn "localStorage\|sessionStorage" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"
# Expected output: ZERO matches for token/auth/user/tenant storage
```

---

## RULE 2: Sanitize All HTML Before Rendering

**CHECK BEFORE EVERY CHANGE:** Does this code use `dangerouslySetInnerHTML`?

```typescript
// ❌ PROHIBITED — XSS vulnerability (OWASP A03:2021)
<div dangerouslySetInnerHTML={{ __html: userContent }} />
<div dangerouslySetInnerHTML={{ __html: clinicalNotes }} />
<div dangerouslySetInnerHTML={{ __html: emailTemplate }} />

// ✅ REQUIRED — always sanitize with DOMPurify
import DOMPurify from 'dompurify';

const CLINICAL_ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'thead', 'tbody'];

const sanitize = (html: string) => DOMPurify.sanitize(html, {
  ALLOWED_TAGS: CLINICAL_ALLOWED_TAGS,
  ALLOWED_ATTR: ['class', 'id'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'style'],
});

<div dangerouslySetInnerHTML={{ __html: sanitize(clinicalNotes) }} />
```

**Validation command:**
```bash
# Find all dangerouslySetInnerHTML without DOMPurify on the same line or prior lines
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx" --include="*.jsx"
# Every match MUST have DOMPurify.sanitize wrapping the content
```

---

## RULE 3: Implement Error Boundaries

**Every application MUST have error boundaries at route level and around clinical data.**

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState { hasError: boolean; error?: Error; }

class AppErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Report to monitoring — scrub PHI before sending
    reportError({
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      // NEVER include: patient data, names, IDs, clinical content
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// REQUIRED: Wrap at route level AND around clinical sections
<AppErrorBoundary>
  <Routes>
    <Route path="/patients/:id" element={
      <AppErrorBoundary fallback={<ClinicalDataFallback />}>
        <PatientDetail />
      </AppErrorBoundary>
    } />
  </Routes>
</AppErrorBoundary>
```

---

## RULE 4: No PHI in Console Logs, URLs, or Tab Titles

```typescript
// ❌ PROHIBITED — PHI exposure (HIPAA §164.528(a))
console.log('Patient data:', patientData);
console.log('Processing patient:', patientName);
console.error('Failed for patient:', patientId, error);
document.title = `${patientName} - Medical Record`;
window.location.href = `/patients?name=${patientName}&dob=${dob}`;

// ✅ REQUIRED
// 1. Never use console.log in production code
// 2. Use a logger that strips PHI:
import { logger } from '@app/utils/logger';
logger.error('Patient record load failed', { requestId, statusCode: error.status });

// 3. Tab titles must be generic:
document.title = 'Patient Record - Portal';

// 4. Never put PHI in URL params — use POST requests or path IDs only:
navigate(`/patients/${patientId}`);
```

**ESLint configuration (REQUIRED in every frontend repo):**
```json
{
  "rules": {
    "no-console": "error",
    "no-debugger": "error"
  }
}
```

---

## RULE 5: PHI Display Minimization

```typescript
// ❌ PROHIBITED — showing all PHI fields by default
<span>{patient.ssn}</span>
<span>{patient.dateOfBirth}</span>

// ✅ REQUIRED — mask by default, reveal on deliberate action with audit
const MaskedField: React.FC<{ value: string; fieldName: string; patientId: string }> = ({
  value, fieldName, patientId
}) => {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    auditService.logFieldAccess({ patientId, fieldName, action: 'REVEAL' });
    // Auto-hide after 30 seconds
    setTimeout(() => setRevealed(false), 30000);
  };

  const mask = (val: string) => {
    if (fieldName === 'ssn') return `***-**-${val.slice(-4)}`;
    if (fieldName === 'dob') return `**/**/` + val.slice(-4);
    return '••••••••';
  };

  return (
    <span>
      {revealed ? value : mask(value)}
      {!revealed && (
        <button onClick={handleReveal} aria-label={`Reveal ${fieldName}`}>
          Show
        </button>
      )}
    </span>
  );
};
```

---

## RULE 6: Payment Card Handling

```typescript
// ❌ PROHIBITED — accepting card data (PCI DSS 4.0 Req 3.2.1)
<input name="cardNumber" onChange={handleCardInput} />
<input name="cvv" onChange={handleCvvInput} />
const handleSubmit = () => api.post('/billing', { cardNumber, cvv, expiry });

// ✅ REQUIRED — use processor-hosted elements
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    // Card data never touches your code — Stripe handles it in an iframe
    const { paymentMethod } = await stripe!.createPaymentMethod({
      type: 'card',
      card: elements!.getElement(CardElement)!,
    });
    // Send only the token to your server
    await api.post('/billing', { paymentMethodId: paymentMethod!.id });
  };

  return <CardElement />; // Renders in isolated iframe
};
```

---

## RULE 7: Session Inactivity Timeout

```typescript
// REQUIRED in every authenticated application
const TIMEOUT_MS = 15 * 60 * 1000; // 15 min for clinical users
const WARNING_MS = 2 * 60 * 1000;  // Show warning 2 min before

const useSessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(warningRef.current);
    setShowWarning(false);

    warningRef.current = setTimeout(
      () => setShowWarning(true),
      TIMEOUT_MS - WARNING_MS
    );
    timerRef.current = setTimeout(() => {
      clearToken();
      navigate('/login?reason=timeout');
    }, TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
    };
  }, [resetTimer]);

  return { showWarning, extendSession: resetTimer };
};
```

---

## RULE 8: Accessibility (WCAG 2.1 AA)

**Apply these checks to EVERY component:**

```typescript
// ❌ PROHIBITED
*:focus { outline: none; }          // Removes focus visibility
<input placeholder="Email" />       // No label
<div onClick={handleClick}>         // Not keyboard accessible
<canvas id="signaturePad" />        // No accessible alternative

// ✅ REQUIRED
// 1. Focus styles — NEVER remove, only customize
*:focus-visible { outline: 2px solid #005fcc; outline-offset: 2px; }

// 2. Form labels — ALWAYS pair with input
<label htmlFor="email">Email Address</label>
<input id="email" type="email" aria-required="true" />

// 3. Interactive elements — ALWAYS keyboard accessible
<button onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
  Action
</button>

// 4. Canvas alternatives
<div>
  <canvas id="signaturePad" aria-label="Signature pad" />
  <div>
    <label htmlFor="typedSignature">Or type your full legal name</label>
    <input id="typedSignature" />
    <label>
      <input type="checkbox" required />
      I attest this is my legal signature
    </label>
  </div>
</div>

// 5. Video captions
<video>
  <track kind="captions" src={captionsUrl} srcLang="en" label="English" default />
</video>
```

**Required ESLint plugin:**
```json
{
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

---

## RULE 9: CSRF Protection

```typescript
// REQUIRED: Include CSRF token in all state-modifying requests
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Send cookies
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Never set API base URL from user input or URL parameters
// ❌ PROHIBITED
const api = axios.create({ baseURL: new URL(window.location.search).get('api') });
```

---

## RULE 10: Mock Data and AI Feature Guards

```typescript
// ❌ PROHIBITED — mock clinical data without labels
const aiRecommendation = { drug: 'Jardiance', confidence: 0.88 };
<div>AI Recommendation: {aiRecommendation.drug} (Confidence: 88%)</div>

// ✅ REQUIRED — prominent labeling + feature flag
const MOCK_DATA_ENABLED = process.env.REACT_APP_MOCK_AI === 'true';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Block in production
if (IS_PRODUCTION && MOCK_DATA_ENABLED) {
  throw new Error('Mock AI data cannot be enabled in production');
}

{MOCK_DATA_ENABLED && (
  <div role="alert" style={{ background: '#ff0000', color: '#fff', padding: 16 }}>
    ⚠️ MOCK DATA — FOR DEMONSTRATION ONLY — NOT CLINICAL ADVICE
  </div>
)}
```

---

## PRE-COMMIT CHECKLIST

Before submitting any frontend code change, verify:

- [ ] No `localStorage.setItem` or `sessionStorage.setItem` for tokens/auth/user data
- [ ] Every `dangerouslySetInnerHTML` uses `DOMPurify.sanitize()`
- [ ] No `console.log`, `console.error`, `console.warn`, or `debugger` statements
- [ ] No PHI in URL parameters, tab titles, or browser notifications
- [ ] All form inputs have associated `<label>` elements
- [ ] All interactive elements are keyboard accessible
- [ ] Error boundaries exist at route level and around clinical data views
- [ ] No `any` type in PHI-handling code
- [ ] No `*:focus { outline: none }` in stylesheets
- [ ] Mock/demo content has prominent labels and is blocked in production
- [ ] No raw card number fields — only processor-hosted elements
- [ ] Session timeout implemented for authenticated views
- [ ] CSRF tokens included in state-modifying requests

---

## VALIDATION COMMANDS

Run these in every frontend repository before merge:

```bash
# Check for prohibited patterns
echo "=== Token Storage ==="
grep -rn "localStorage\.\(set\|get\)Item\|sessionStorage\.\(set\|get\)Item" src/ --include="*.ts*" --include="*.js*" | grep -i "token\|auth\|user\|tenant\|session\|jwt"

echo "=== Unsanitized HTML ==="
grep -rn "dangerouslySetInnerHTML" src/ --include="*.ts*" --include="*.js*" | grep -v "DOMPurify\|sanitize"

echo "=== Console Statements ==="
grep -rn "console\.\(log\|error\|warn\|debug\)" src/ --include="*.ts*" --include="*.js*" | grep -v "node_modules\|\.test\.\|\.spec\."

echo "=== Focus Removal ==="
grep -rn "outline.*none\|outline.*0" src/ --include="*.css" --include="*.scss"

echo "=== Missing Labels ==="
grep -rn "placeholder=" src/ --include="*.tsx" --include="*.jsx" | grep -v "label\|Label\|aria-label"

# All commands should return ZERO results for compliant code
```
