export type UserTask = {
  summary: string;
  time: string[];
  color: string;
  selectedTime: string;
  option: string;
  pickedTime: string[];
  telegramId: number,
  minutes: number,
  startTime: string,
  endTime: string,
};

export type Task = {
  id: string;
  name: string;
  time: string;
  summary: string;
  color: string;
  pickedTime: string;
  telegramId: string;
  link: string;
};

export type ComboboxOption = {
  label: string;
  value: string | number;
};
