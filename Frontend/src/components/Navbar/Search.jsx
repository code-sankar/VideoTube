import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import Input from "../Input";
import Button from "../Button";

function Search() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (data?.query?.trim()) {
      navigate(`/search/${data.query}`);
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full max-w-lg"
      aria-label="Search form"
    >
      {/* Search Input */}
      <div className="relative flex-grow">
        <Input
          className="rounded-l-3xl pl-10 pr-4 py-2"
          placeholder="Search"
          aria-label="Search input"
          {...register("query", { required: true })}
        />
        <GoSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
          aria-hidden="true"
        />
      </div>

      {/* Search Button */}
      <Button
        type="submit"
        bgColor="bg-zinc-800"
        className="rounded-r-3xl hover:bg-gray-500 transition-colors outline-none border-gray-200 border px-4 py-2"
        aria-label="Search button"
      >
        Search
      </Button>
    </form>
  );
}

export default Search;
