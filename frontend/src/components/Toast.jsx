import { useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const bgClass = type === 'success' ? 'text-bg-success' : type === 'error' ? 'text-bg-danger' : 'text-bg-warning';
  const icon = type === 'success' ? '/images/check.png' : type === 'error' ? '/images/cross.png' : '/images/warn.png';

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ marginTop: '60px', zIndex: 1050 }}>
      <div className={`toast show align-items-center ${bgClass} border-0 w-auto`} role="alert">
        <div className="d-flex">
          <div className="toast-body">
            <img src={icon} style={{ height: '20px', marginRight: '8px' }} alt="icon" />
            <span style={{ color: 'black', fontSize: '14px', fontFamily: "'Barlow', sans-serif" }}>{message}</span>
          </div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            onClick={() => { setVisible(false); onClose?.(); }}
          ></button>
        </div>
      </div>
    </div>
  );
}
