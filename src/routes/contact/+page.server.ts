import { GOOGLE_CHAT_WEBHOOK } from "$env/static/private";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const message = formData.get('message')?.toString();
    const name = formData.get('name')?.toString();

    await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `Hello! ${name} would like to be emailed at ${email} with the following message: ${message}`
      })
    })

    
  }
}
