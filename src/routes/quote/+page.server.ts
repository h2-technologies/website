import { GOOGLE_CHAT_WEBHOOK } from '$env/static/private';
import { prisma } from '$lib/db';
import { storage } from '$lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

import type { Actions } from "./$types";
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {

    const formData = await request.formData();

    const fileIds: string[] = [];
    
    const files = formData.getAll('files') as File[];
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const companyName = formData.get('companyName') as string;
    const serviceCategory = formData.get('serviceCategory') as string;
    const projectTitle = formData.get('projectTitle') as string;
    const projectDescription = formData.get('projectDescription') as string;
    const projectGoals = formData.get('projectGoals') as string;
    const targetAudience = formData.get('targetAudience') as string;
    const keyFeatures = formData.get('keyFeatures') as string;
    const devRequirements = formData.get('devRequirements') as string;
    const workspaceRequirements = formData.get('workspaceRequirements') as string;
    const fortinetRequirements = formData.get('fortinetRequirements') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const budget = formData.get('budget') as string;
    const existingSystems = formData.get('existingSystems') as string;
    const numEmployees = formData.get('numEmployees') as string;
    const numLocations = formData.get('numLocations') as string;
    const networkInfrastructure = formData.get('networkInfrastructure') as string;
    const securityRequirements = formData.get('securityRequirements') as string;
    const complianceRequirements = formData.get('complianceRequirements') as string;

    const data = await prisma.quote.create({
      data: {
        fullName,
        email,
        phone,
        company: companyName,
        serviceCategory,
        projectTitle,
        projectDescription,
        projectGoals,
        targetAudience,
        keyFeatures,
        devRequirements,
        workspaceRequirements,
        fortinetRequirements,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget),
        existingSystems,
        numEmployees: parseInt(numEmployees),
        numLocations: parseInt(numLocations),
        networkInfrastructure,
        securityRequirements,
        complianceRequirements,
        files: ""
      }
    })

    if (files.length > 0) {
      for (const file of files) {
        const fileId = crypto.randomUUID();
        const fileRef = ref(storage, `${data.id}/${fileId}`);
        //eslint-disable-next-line
        uploadBytes(fileRef, file).then((_) => {
          fileIds.push(fileId);
        });
      }
    }

    await prisma.quote.update({
      where: {
        id: data.id
      },
      data: {
        files: fileIds.join(',')
      }
    })
    

    await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `Hello! ${fullName} submitted a quote request.`
      })
    })

    //TODO: Send user to success page
    redirect(303, '/quote/success');
    
  }
}