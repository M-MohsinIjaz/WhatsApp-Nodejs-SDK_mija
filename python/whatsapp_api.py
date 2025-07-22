import os
from typing import Any, Dict, Optional

import requests


class WhatsAppAPI:
    """Simple helper for sending WhatsApp Cloud API messages."""

    def __init__(
        self,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
        api_version: Optional[str] = None,
        base_url: Optional[str] = None,
    ) -> None:
        self.phone_number_id = phone_number_id or os.getenv("WA_PHONE_NUMBER_ID")
        self.access_token = access_token or os.getenv("CLOUD_API_ACCESS_TOKEN")
        self.api_version = api_version or os.getenv("CLOUD_API_VERSION", "v16.0")
        self.base_url = base_url or os.getenv("WA_BASE_URL", "https://graph.facebook.com")

        if not self.phone_number_id:
            raise ValueError("phone_number_id is required")
        if not self.access_token:
            raise ValueError("access_token is required")

    # internal helper to compute URL and send POST request
    def _post(self, endpoint: str, payload: Dict[str, Any]) -> requests.Response:
        url = f"{self.base_url}/{self.api_version}/{self.phone_number_id}/{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }
        return requests.post(url, headers=headers, json=payload, timeout=20)

    def send_text(
        self,
        recipient: str,
        body: str,
        *,
        preview_url: bool = False,
        reply_to: Optional[str] = None,
    ) -> requests.Response:
        """Send a text message."""
        payload: Dict[str, Any] = {
            "messaging_product": "whatsapp",
            "to": str(recipient),
            "type": "text",
            "text": {"body": body, "preview_url": preview_url},
        }
        if reply_to:
            payload["context"] = {"message_id": reply_to}
        return self._post("messages", payload)

    def send_template(
        self,
        recipient: str,
        template: Dict[str, Any],
        *,
        reply_to: Optional[str] = None,
    ) -> requests.Response:
        """Send a template message.

        The ``template`` dictionary should follow the format required by the
        WhatsApp Cloud API ``template`` payload.
        """
        payload: Dict[str, Any] = {
            "messaging_product": "whatsapp",
            "to": str(recipient),
            "type": "template",
            "template": template,
        }
        if reply_to:
            payload["context"] = {"message_id": reply_to}
        return self._post("messages", payload)


__all__ = ["WhatsAppAPI"]
