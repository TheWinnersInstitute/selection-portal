"use client";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import UsersTable from "./users-table";
import UserForm from "./user-form";
import { useLoading } from "@/hooks/use-loading";

export default function ClientUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editData, setEditData] = useState<null | User>(null);
  const [openUserForm, setOpenUserForm] = useState(false);

  const { apiClient, isAuthenticated } = useAuth();
  const fetchingUsers = useLoading(true);
  const fetchingRoles = useLoading(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchingUsers.asyncWrapper(async () => {
        const { data } = await apiClient.get("/api/admin/user");
        setUsers(data.data);
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchingRoles.asyncWrapper(async () => {
        const { data } = await apiClient.get("/api/admin/role");
        setRoles(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleUserForm = () => setOpenUserForm((prev) => !prev);

  if (fetchingUsers.unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="font-bold opacity-55">
          You are not authorized to access this screen
        </h2>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-3 pt-3 mb-3">
        <h2 className="font-semibold">Users</h2>
        <Button disabled={fetchingRoles.unauthorized} onClick={toggleUserForm}>
          {fetchingRoles.loader || "Add User"}
        </Button>
      </div>
      {fetchingUsers.loading && (
        <div className="flex justify-center py-3">{fetchingUsers.loader}</div>
      )}
      {!fetchingUsers.loading && (
        <UsersTable
          setUsers={setUsers}
          toggleUserForm={toggleUserForm}
          setEditData={setEditData}
          users={users}
        />
      )}
      <UserForm
        editData={editData}
        roles={roles}
        setUsers={setUsers}
        openUserForm={openUserForm}
        toggleUserForm={toggleUserForm}
        setEditData={setEditData}
      />
    </div>
  );
}
