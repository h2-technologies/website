import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const message = formData.get('message')?.toString();
    const name = formData.get('name')?.toString();

    await fetch("https://chat.googleapis.com/v1/spaces/AAAAMpMBOZY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=DN6sPO4l76201IGpD-VmGyAISjQZWhQHkVlRvjTQhd4", {
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