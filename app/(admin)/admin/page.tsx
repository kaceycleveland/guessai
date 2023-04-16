import { getCurrentDate } from '@/lib/utils/get-current-date';

import { GenerateButton } from './generate-button';
import { WordManagement } from './word-management';

export const revalidate = 0;

export default async function AdminPage() {
  const { data: currentDate } = await getCurrentDate();
  if (!currentDate) throw Error();
  return (
    <div className="w-full ">
      <WordManagement currentDate={currentDate} />
      <GenerateButton />
    </div>
  );
}
