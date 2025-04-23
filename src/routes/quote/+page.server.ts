import { prisma } from '$lib/db';

import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {

    const formData = await request.formData();

    console.log(Object.fromEntries(formData));
    
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

    //TODO: Implement upload thing
    
    //TODO: Insert to DB

    //TODO: Send google chat webhook

    //TODO: Send OK Status
  }
}