import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function FloatingWhatsApp() {
  const { settings } = useApp();
  const rawPhone = settings?.whatsapp || settings?.phone || '+919876543210';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Roamora Travels! I would like to inquire about a luxury holiday package.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Chat with us on WhatsApp"
      aria-label="WhatsApp Chat"
    >
      <MessageCircle size={30} />
    </a>
  );
}
