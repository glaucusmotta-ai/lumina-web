class WhatsAppService:
    def send_message(
        self,
        phone: str,
        message: str
    ):
        return {
            "success": False,
            "provider": None,
            "message": "WhatsApp provider not configured yet."
        }
        
        
        