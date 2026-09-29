import React from 'react';

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options = [], // for select type
  rows = 4, // for textarea type
  icon: Icon,
  helpText,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--terracotta)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }}>
            <Icon size={18} />
          </div>
        )}
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="form-control"
            style={Icon ? { paddingLeft: '40px' } : {}}
            {...props}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className="form-control"
            style={Icon ? { paddingLeft: '40px' } : {}}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="form-control"
            style={Icon ? { paddingLeft: '40px' } : {}}
            {...props}
          />
        )}
      </div>
      {helpText && <span style={{ fontSize: '0.78rem', color: '#777', marginTop: '0.25rem' }}>{helpText}</span>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
