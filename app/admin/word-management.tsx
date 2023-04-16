import { Calendar } from "./calendar";

interface WordManagementProps {
  currentDate: string;
}

export const revalidate = 0;

export const WordManagement = ({ currentDate }: WordManagementProps) => {
  return (
    <div className="flex">
      <Calendar currentDate={currentDate} />
    </div>
  );
};
