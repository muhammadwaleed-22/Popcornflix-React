import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import CustomSelect from "./CustomSelect"
import Card from "./Card"; 

export default function Hero() {

  return (
    <section className="bg-white text-black py-4">
      <div className="w-full max-w-6xl mx-auto px-6">
        
        <Form
          className="mb-6 flex gap-4 flex-col sm:flex-row items-start sm:items-center"
          
        >
          <Input
            isRequired
            // isDisabled={isLoading}
            label="Search Term"
            labelPlacement="outside"
            name="query"
            placeholder="Search movies..."
            className="flex-1"
          />
          <Button
            color="primary"
            variant="flat"
            // isLoading={isLoading}
            type="submit"
            className="mt-6"
          >
            Search
          </Button>
        </Form>
        <CustomSelect />
      </div>
    </section>
  );
}
