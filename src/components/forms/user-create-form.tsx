"use client";

import { Endpoints, toUrl } from "@/lib/routes";

const UserCreateForm = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetch(toUrl(Endpoints.Users), {
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
