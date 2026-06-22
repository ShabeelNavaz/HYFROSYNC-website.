import { MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

function WhatsAppButton() {
  const { settings } = useSite();

  if (!settings.company_whatsapp) return null;

  const whatsappUrl = `https://wa.me/${settings.company_whatsapp.replace(/\D/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}

export default WhatsAppButton;
