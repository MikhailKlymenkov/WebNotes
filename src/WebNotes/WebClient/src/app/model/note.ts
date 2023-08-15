export interface Note {
  id: number;
  title: string;
  body: string;
  creationDate: Date | undefined;
  isEdited: boolean;
}
