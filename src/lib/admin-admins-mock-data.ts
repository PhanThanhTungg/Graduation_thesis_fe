export interface AdminListItem {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    title: string | null;
  };
  createdAt: string;
  updatedAt: string | null;
}

export const getAdmins = (): AdminListItem[] => {
  return [
    {
      id: "1",
      fullName: "Nguyễn Văn An",
      email: "nguyenvanan@aikabis.com",
      role: {
        id: "1",
        title: "Super Admin",
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: "2",
      fullName: "Trần Thị Bình",
      email: "tranthibinh@aikabis.com",
      role: {
        id: "2",
        title: "Content Manager",
      },
      createdAt: "2024-02-10T09:00:00Z",
      updatedAt: null,
    },
    {
      id: "3",
      fullName: "Lê Minh Cường",
      email: "leminhcuong@aikabis.com",
      role: {
        id: "3",
        title: "User Manager",
      },
      createdAt: "2024-03-05T14:20:00Z",
      updatedAt: "2024-03-10T11:00:00Z",
    },
    {
      id: "4",
      fullName: "Phạm Thị Dung",
      email: "phamthidung@aikabis.com",
      role: {
        id: "4",
        title: "Viewer",
      },
      createdAt: "2024-03-15T08:30:00Z",
      updatedAt: null,
    },
  ];
};
