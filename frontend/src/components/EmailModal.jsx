import { useState, useEffect } from 'react';
import API from '../api/axios';
import './EmailModal.css';

export default function EmailModal({ candidate, hirerProfile, onClose }) {
  const [to, setTo] = useState(candidate?.email || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  const companyName = hirerProfile?.company_name || 'Our Company';
  const yourName    = hirerProfile?.your_name || '';
  const yourRole    = hirerProfile?.your_role || 'Hiring Team';
  const candidateName = candidate?.name || 'Candidate';

  useEffect(() => {
    setSubject(`Interview Invitation — ${companyName}`);
    setBody(
`Dear ${candidateName},

We came across your profile and were impressed by your background. We would like to invite you for an interview at ${companyName}.

Please reply to this email at your earliest convenience to schedule a time that works for you.

We look forward to hearing from you!

Best regards,
${yourName ? yourName + '\n' : ''}${yourRole} — ${companyName}`
    );
  }, [candidateName, companyName, yourName, yourRole]);

  const handleSend = async () => {
    if (!to.trim()) { setStatus({ type: 'error', message: 'Recipient email is required.' }); return; }
    if (!subject.trim()) { setStatus({ type: 'error', message: 'Subject is required.' }); return; }
    if (!body.trim()) { setStatus({ type: 'error', message: 'Email body is required.' }); return; }

    setLoading(true);
    setStatus(null);
    try {
      const res = await API.post('/send-email', { to_email: to, subject, body });
      setStatus({ type: 'success', message: res.data.message });
      setTimeout(() => onClose(), 2200);
    } catch (e) {
      setStatus({ type: 'error', message: e.response?.data?.error || 'Failed to send email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="em-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="em-modal">
        {/* Header */}
        <div className="em-header">
          <div className="em-header-left">
            <span className="em-icon">✉️</span>
            <div>
              <h3 className="em-title">Send Email</h3>
              <p className="em-sub">to <strong>{candidateName}</strong></p>
            </div>
          </div>
          <button className="em-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="em-body">
          <div className="em-field">
            <label htmlFor="em-to">To</label>
            <input
              id="em-to"
              type="email"
              className="em-input"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="candidate@email.com"
            />
          </div>

          <div className="em-field">
            <label htmlFor="em-subject">Subject</label>
            <input
              id="em-subject"
              type="text"
              className="em-input"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className="em-field">
            <label htmlFor="em-body">Message</label>
            <textarea
              id="em-body"
              className="em-textarea"
              rows={11}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          {status && (
            <div className={`em-status ${status.type}`}>
              {status.type === 'success' ? '✅' : '❌'} {status.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="em-footer">
          <button className="em-btn secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="em-btn primary" onClick={handleSend} disabled={loading}>
            {loading ? <span className="em-spinner" /> : '📨 Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
