import React from 'react';
import { Pagination, Button } from '@heroui/react';

function Paggination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <p className="text-small text-default-500">
        Selected Page: {currentPage}
      </p>

      <Pagination
        color="secondary"
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
      />

      <div className="flex gap-2">
        <Button
          color="secondary"
          size="sm"
          variant="flat"
          onPress={() =>
            onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)
          }
        >
          Previous
        </Button>

        <Button
          color="secondary"
          size="sm"
          variant="flat"
          onPress={() =>
            onPageChange(
              currentPage < totalPages ? currentPage + 1 : currentPage
            )
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Paggination;
