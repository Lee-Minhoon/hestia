"use client";

const baseUrl = "http://localhost:3000";

const UserCreateForm = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetch(`${baseUrl}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }}
    >
      <p>User Create</p>
      <button type={"submit"}>Create</button>
    </form>
  );
};

export { UserCreateForm };
