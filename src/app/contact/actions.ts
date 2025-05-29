'use server'

export async function sendContactData(formData: FormData) {
  const email = formData.get('email')?.toString();
  const message = formData.get('message')?.toString();
  const name = formData.get('name')?.toString();

  await fetch(process.env.GOOGLE_CHAT_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: `Hello! ${name} would like to be emailed at ${email} with the following message: ${message}`
    })
  })
}