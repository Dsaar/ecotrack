import bcrypt from "bcryptjs";

export const usersSeed = async () => {
  const salt = await bcrypt.genSalt(10);

  return [
    {
      name: { first: "Admin", middle: "", last: "User" },
      email: "admin@example.com",
      passwordHash: await bcrypt.hash("Admin#1234", salt),
      phone: "050-0000000",
      address: {
        country: "Israel",
        city: "Tel Aviv",
        street: "Admin St",
        houseNumber: 1,
        zip: 11111,
        state: ""
      },
      avatarUrl: {
        url: "https://picsum.photos/200?admin",
        alt: "admin avatar"
      },
      isAdmin: true,
      points: 0,
      favorites: { missions: [], submissions: [] }
    },
    {
      name: { first: "Daniel", middle: "", last: "Saar" },
      email: "user1@example.com",
      passwordHash: await bcrypt.hash("Admin#1234", salt),
      phone: "050-1234567",
      address: {
        country: "Israel",
        city: "Tel Aviv",
        street: "Herzl",
        houseNumber: 10,
        zip: 12345,
        state: ""
      },
      avatarUrl: {
        url: "https://picsum.photos/200?user1",
        alt: "user avatar"
      },
      isAdmin: false,
      points: 0,
      favorites: { missions: [], submissions: [] }
    }
  ];
};
