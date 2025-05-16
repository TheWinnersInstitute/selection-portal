import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { Filter } from "lucide-react";
import React, { useState } from "react";
import { StudentSearch } from "..";

export default function StudentFilter({ setSearch, search }: Props) {
  const [filter, setFilter] = useState<StudentSearch>(search);
  const [openPopup, setOpenPopup] = useState(false);

  const { exams } = useData();

  const applyFilterHandler = () => {
    setSearch(filter);
    togglePopup();
  };

  const resetFilterHandler = () => {
    setSearch({});
    setFilter({});
    togglePopup();
  };

  const togglePopup = () => setOpenPopup((prev) => !prev);

  const searchCount = Object.keys(search).length;

  return (
    <Popover open={openPopup} onOpenChange={togglePopup}>
      <PopoverTrigger asChild>
        <Button>
          <Filter /> {searchCount ? `(${searchCount})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter</h4>
          </div>
          <div className="grid gap-2">
            <Input
              value={filter.q || ""}
              placeholder="Search name, father, email, phone..."
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  q: e.target.value,
                }))
              }
            />
            <Select
              value={filter.examId || ""}
              onValueChange={(value) => {
                setFilter((prev) => {
                  if (value === "all") {
                    delete prev["examId"];
                    return { ...prev };
                  }
                  return {
                    ...prev,
                    examId: value,
                  };
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Exams</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  {exams.map((exam) => {
                    return (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={filter.year || ""}
              onValueChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  year: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {["2020", "2021", "2022", "2023", "2024", "2025"].map(
                    (year) => {
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex justify-between items-center mt-2">
              <Button onClick={resetFilterHandler} variant="outline">
                Clear
              </Button>
              <Button onClick={applyFilterHandler}>Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<StudentSearch>>;
  search: StudentSearch;
};
