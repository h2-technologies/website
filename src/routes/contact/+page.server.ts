import type { Actions } from "@sveltejs/kit";
import { prisma } from "$lib/db";

export const actions: Actions = {
  default: async({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const message = formData.get('message')?.toString();
    const name = formData.get('name')?.toString();
    const subject = formData.get('subject')?.toString();

    if (!email || !message || !name || !subject) {
      return { success: false, error: 'All fields are required.' };
    }

    await prisma.contactRequest.create({
      data: {
        name,
        email,
        subject, 
        message
      }
    })

    return { success: true };
    
  }
}
