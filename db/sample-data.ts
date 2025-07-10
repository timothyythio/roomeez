import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      emailVerified: null,
      password: hashSync("123456", 10),
      phoneNumber: "1234567890",
      role: "user",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      emailVerified: null,
      password: hashSync("123456", 10),
      phoneNumber: "9876543210",
      role: "admin",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Charlie Doe",
      email: "charlie@example.com",
      emailVerified: null,
      password: hashSync("123456", 10),
      phoneNumber: null,
      role: "user",
      image: null,
    },
  ],

  household: {
    name: "Metro Apartment",
  },

  householdMembers: [
    { userEmail: "alice@example.com", role: "admin" },
    { userEmail: "bob@example.com", role: "member" },
    { userEmail: "charlie@example.com", role: "member" },
  ],

  bills: [
    {
      title: "Electricity Bill",
      amount: 90.0,
      paidByEmail: "alice@example.com",
      splits: {
        "alice@example.com": 30.0,
        "bob@example.com": 30.0,
        "charlie@example.com": 30.0,
      },
    },
    {
      title: "Water Bill",
      amount: 60.0,
      paidByEmail: "bob@example.com",
      splits: {
        "alice@example.com": 20.0,
        "bob@example.com": 20.0,
        "charlie@example.com": 20.0,
      },
    },
  ],
};

export default sampleData;
