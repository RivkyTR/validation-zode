import React, { useState } from "react";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().regex(/^\d{8,9}$/, "ID must be a string with 8 to 9 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  family: z.string().min(2, "Family must be at least 2 characters"),
  dateOfBirth: z.date().refine((date) => date < new Date(), {
    message: "Date of Birth must be in the past",
  }),
  email: z.string().email("Invalid email address"),
});

type UserData = z.infer<typeof UserSchema>;

const Card = () => {
  const [formData, setFormData] = useState<UserData>({
    id: "",
    name: "",
    family: "",
    dateOfBirth: new Date(),
    email: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form data
      UserSchema.parse(formData);
      setErrors({});
      console.log(formData); // Print data to console
      alert("Form submitted successfully!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Map errors to error state
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "dateOfBirth" ? new Date(value) : value,
    });
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 shadow-md rounded-md"
      >
        <div className="mb-4 text-right">
          <h2 className="text-xl font-semibold mb-2">פרטים אישיים</h2>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                name="id"
                placeholder="ID"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.id}
                onChange={handleChange}
              />
              {errors.id && <p className="text-red-500">{errors.id}</p>}
            </div>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="family"
                placeholder="Family"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.family}
                onChange={handleChange}
              />
              {errors.family && <p className="text-red-500">{errors.family}</p>}
            </div>
            <div>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.dateOfBirth.toISOString().split("T")[0]}
                onChange={handleChange}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4 text-right">
          <h2 className="text-xl font-semibold mb-2">פרטי התקשרות</h2>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Card;
