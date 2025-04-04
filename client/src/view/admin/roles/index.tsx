"use client";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import RolesTable from "./roles-table";
import RoleForm from "./role-form";
import { useLoading } from "@/hooks/use-loading";

export default function ClientRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editData, setEditData] = useState<null | Role>(null);
  const [openRoleForm, setOpenRoleForm] = useState(false);

  const { apiClient, isAuthenticated } = useAuth();

  const fetchingRoles = useLoading();

  useEffect(() => {
    if (isAuthenticated) {
      fetchingRoles.asyncWrapper(async () => {
        const { data } = await apiClient.get("/api/admin/role");
        setRoles(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleRoleForm = () => setOpenRoleForm((prev) => !prev);

  if (fetchingRoles.unauthorized) {
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
        <h2 className="font-semibold">Roles</h2>
        <Button onClick={toggleRoleForm}>Add Role</Button>
      </div>
      {fetchingRoles.loader}
      {!fetchingRoles.loading && (
        <RolesTable
          setRoles={setRoles}
          toggleRoleForm={toggleRoleForm}
          setEditData={setEditData}
          roles={roles}
        />
      )}
      <RoleForm
        editData={editData}
        setRoles={setRoles}
        openRoleForm={openRoleForm}
        toggleRoleForm={toggleRoleForm}
        setEditData={setEditData}
      />
    </div>
  );
}
