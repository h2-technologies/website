import { redirect } from '@sveltejs/kit';

// Redirect GET /dialpad to the external Zift URL with a 302 status
export const GET = () => {
  throw redirect(
    302,
    'https://sites.ziftsolutions.com/sandlerpartners.ziftsolutions.com/8a998ad39a118921019a180a96f43253'
  );
};
