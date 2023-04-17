import { Calendar } from './calendar';

interface WordManagementProps {
  currentDate: string;
}

export const revalidate = 0;

export const WordManagement = ({ currentDate }: WordManagementProps) => {
  return (
    <div className="flex w-full">
      <Calendar currentDate={currentDate} />
    </div>
  );
};
